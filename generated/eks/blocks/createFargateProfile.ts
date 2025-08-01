import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, CreateFargateProfileCommand } from "@aws-sdk/client-eks";

const createFargateProfile: AppBlock = {
  name: "Create Fargate Profile",
  description: "Creates an Fargate profile for your Amazon EKS cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        fargateProfileName: {
          name: "fargate Profile Name",
          description: "The name of the Fargate profile.",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        podExecutionRoleArn: {
          name: "pod Execution Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the Pod execution role to use for a Pod that matches the selectors in the Fargate profile.",
          type: "string",
          required: true,
        },
        subnets: {
          name: "subnets",
          description: "The IDs of subnets to launch a Pod into.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        selectors: {
          name: "selectors",
          description:
            "The selectors to match for a Pod to use this Fargate profile.",
          type: {
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
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        tags: {
          name: "tags",
          description:
            "Metadata that assists with categorization and organization.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
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

        const command = new CreateFargateProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Fargate Profile Result",
      description: "Result from CreateFargateProfile operation",
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
            description: "The full description of your new Fargate profile.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createFargateProfile;
