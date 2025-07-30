import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeAddonVersionsCommand } from "@aws-sdk/client-eks";

const describeAddonVersions: AppBlock = {
  name: "Describe Addon Versions",
  description: "Describes the versions for an add-on.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        kubernetesVersion: {
          name: "kubernetes Version",
          description:
            "The Kubernetes versions that you can use the add-on with.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of results, returned in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        addonName: {
          name: "addon Name",
          description: "The name of the add-on.",
          type: "string",
          required: false,
        },
        types: {
          name: "types",
          description: "The type of the add-on.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        publishers: {
          name: "publishers",
          description: "The publisher of the add-on.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        owners: {
          name: "owners",
          description: "The owner of the add-on.",
          type: {
            type: "array",
            items: {
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

        const command = new DescribeAddonVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Addon Versions Result",
      description: "Result from DescribeAddonVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          addons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                addonName: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                addonVersions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      addonVersion: {
                        type: "object",
                        additionalProperties: true,
                      },
                      architecture: {
                        type: "object",
                        additionalProperties: true,
                      },
                      computeTypes: {
                        type: "object",
                        additionalProperties: true,
                      },
                      compatibilities: {
                        type: "object",
                        additionalProperties: true,
                      },
                      requiresConfiguration: {
                        type: "object",
                        additionalProperties: true,
                      },
                      requiresIamPermissions: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
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
              },
              additionalProperties: false,
            },
            description:
              "The list of available versions with Kubernetes version compatibility and other properties.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribeAddonVersions request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAddonVersions;
