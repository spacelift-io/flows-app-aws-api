import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, DescribeCustomKeyStoresCommand } from "@aws-sdk/client-kms";

const describeCustomKeyStores: AppBlock = {
  name: "Describe Custom Key Stores",
  description:
    "Gets information about custom key stores in the account and Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CustomKeyStoreId: {
          name: "Custom Key Store Id",
          description:
            "Gets only information about the specified custom key store.",
          type: "string",
          required: false,
        },
        CustomKeyStoreName: {
          name: "Custom Key Store Name",
          description:
            "Gets only information about the specified custom key store.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Use this parameter to specify the maximum number of items to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter in a subsequent request after you receive a response with truncated results.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
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

        const command = new DescribeCustomKeyStoresCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Custom Key Stores Result",
      description: "Result from DescribeCustomKeyStores operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CustomKeyStores: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CustomKeyStoreId: {
                  type: "string",
                },
                CustomKeyStoreName: {
                  type: "string",
                },
                CloudHsmClusterId: {
                  type: "string",
                },
                TrustAnchorCertificate: {
                  type: "string",
                },
                ConnectionState: {
                  type: "string",
                },
                ConnectionErrorCode: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
                CustomKeyStoreType: {
                  type: "string",
                },
                XksProxyConfiguration: {
                  type: "object",
                  properties: {
                    Connectivity: {
                      type: "string",
                    },
                    AccessKeyId: {
                      type: "string",
                    },
                    UriEndpoint: {
                      type: "string",
                    },
                    UriPath: {
                      type: "string",
                    },
                    VpcEndpointServiceName: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Contains metadata about each custom key store.",
          },
          NextMarker: {
            type: "string",
            description:
              "When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.",
          },
          Truncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items in the list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCustomKeyStores;
