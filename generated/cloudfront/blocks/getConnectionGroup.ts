import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetConnectionGroupCommand,
} from "@aws-sdk/client-cloudfront";

const getConnectionGroup: AppBlock = {
  name: "Get Connection Group",
  description: "Gets information about a connection group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identifier: {
          name: "Identifier",
          description:
            "The ID, name, or Amazon Resource Name (ARN) of the connection group.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetConnectionGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Connection Group Result",
      description: "Result from GetConnectionGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConnectionGroup: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreatedTime: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              Tags: {
                type: "object",
                properties: {
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Value: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Key"],
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
              Ipv6Enabled: {
                type: "boolean",
              },
              RoutingEndpoint: {
                type: "string",
              },
              AnycastIpListId: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              IsDefault: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description: "The connection group that you retrieved.",
          },
          ETag: {
            type: "string",
            description: "The current version of the connection group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getConnectionGroup;
