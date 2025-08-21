import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeUpdateCommand } from "@aws-sdk/client-eks";

const describeUpdate: AppBlock = {
  name: "Describe Update",
  description: "Describes an update to an Amazon EKS resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description:
            "The name of the Amazon EKS cluster associated with the update.",
          type: "string",
          required: true,
        },
        updateId: {
          name: "update Id",
          description: "The ID of the update to describe.",
          type: "string",
          required: true,
        },
        nodegroupName: {
          name: "nodegroup Name",
          description:
            "The name of the Amazon EKS node group associated with the update.",
          type: "string",
          required: false,
        },
        addonName: {
          name: "addon Name",
          description: "The name of the add-on.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeUpdateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Update Result",
      description: "Result from DescribeUpdate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          update: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              status: {
                type: "string",
              },
              type: {
                type: "string",
              },
              params: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              createdAt: {
                type: "string",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    errorCode: {
                      type: "string",
                    },
                    errorMessage: {
                      type: "string",
                    },
                    resourceIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "The full description of the specified update.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeUpdate;
