import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeAddonCommand } from "@aws-sdk/client-eks";

const describeAddon: AppBlock = {
  name: "Describe Addon",
  description: "Describes an Amazon EKS add-on.",
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
        addonName: {
          name: "addon Name",
          description: "The name of the add-on.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeAddonCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Addon Result",
      description: "Result from DescribeAddon operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          addon: {
            type: "object",
            properties: {
              addonName: {
                type: "string",
              },
              clusterName: {
                type: "string",
              },
              status: {
                type: "string",
              },
              addonVersion: {
                type: "string",
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
              addonArn: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              modifiedAt: {
                type: "string",
              },
              serviceAccountRoleArn: {
                type: "string",
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              publisher: {
                type: "string",
              },
              owner: {
                type: "string",
              },
              marketplaceInformation: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                  },
                  productUrl: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              configurationValues: {
                type: "string",
              },
              podIdentityAssociations: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "An Amazon EKS add-on.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAddon;
