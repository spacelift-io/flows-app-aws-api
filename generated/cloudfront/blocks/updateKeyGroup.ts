import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateKeyGroupCommand,
} from "@aws-sdk/client-cloudfront";

const updateKeyGroup: AppBlock = {
  name: "Update Key Group",
  description: "Updates a key group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyGroupConfig: {
          name: "Key Group Config",
          description: "The key group configuration.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Items: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Name", "Items"],
            additionalProperties: false,
          },
          required: true,
        },
        Id: {
          name: "Id",
          description: "The identifier of the key group that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description: "The version of the key group that you are updating.",
          type: "string",
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
        });

        const command = new UpdateKeyGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Key Group Result",
      description: "Result from UpdateKeyGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyGroup: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              KeyGroupConfig: {
                type: "object",
                properties: {
                  Name: {
                    type: "string",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  Comment: {
                    type: "string",
                  },
                },
                required: ["Name", "Items"],
                additionalProperties: false,
              },
            },
            required: ["Id", "LastModifiedTime", "KeyGroupConfig"],
            additionalProperties: false,
            description: "The key group that was just updated.",
          },
          ETag: {
            type: "string",
            description: "The identifier for this version of the key group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateKeyGroup;
