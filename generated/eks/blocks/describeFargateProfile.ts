import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeFargateProfileCommand } from "@aws-sdk/client-eks";

const describeFargateProfile: AppBlock = {
  name: "Describe Fargate Profile",
  description: "Describes an Fargate profile.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        fargateProfileName: {
          name: "fargate Profile Name",
          description: "The name of the Fargate profile to describe.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeFargateProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Fargate Profile Result",
      description: "Result from DescribeFargateProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          fargateProfile: {
            type: "object",
            properties: {
              fargateProfileName: {
                type: "string",
              },
              fargateProfileArn: {
                type: "string",
              },
              clusterName: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              podExecutionRoleArn: {
                type: "string",
              },
              subnets: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              selectors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    namespace: {
                      type: "string",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              status: {
                type: "string",
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              health: {
                type: "object",
                properties: {
                  issues: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "object",
                          additionalProperties: true,
                        },
                        message: {
                          type: "object",
                          additionalProperties: true,
                        },
                        resourceIds: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "The full description of your Fargate profile.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeFargateProfile;
