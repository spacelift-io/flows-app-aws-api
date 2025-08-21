import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateConnectionGroupCommand,
} from "@aws-sdk/client-cloudfront";

const updateConnectionGroup: AppBlock = {
  name: "Update Connection Group",
  description: "Updates a connection group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the connection group.",
          type: "string",
          required: true,
        },
        Ipv6Enabled: {
          name: "Ipv6Enabled",
          description: "Enable IPv6 for the connection group.",
          type: "boolean",
          required: false,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the connection group that you're updating.",
          type: "string",
          required: true,
        },
        AnycastIpListId: {
          name: "Anycast Ip List Id",
          description: "The ID of the Anycast static IP list.",
          type: "string",
          required: false,
        },
        Enabled: {
          name: "Enabled",
          description: "Whether the connection group is enabled.",
          type: "boolean",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateConnectionGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Connection Group Result",
      description: "Result from UpdateConnectionGroup operation",
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
            description: "The connection group that you updated.",
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

export default updateConnectionGroup;
