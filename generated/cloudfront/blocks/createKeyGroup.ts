import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateKeyGroupCommand,
} from "@aws-sdk/client-cloudfront";

const createKeyGroup: AppBlock = {
  name: "Create Key Group",
  description:
    "Creates a key group that you can use with CloudFront signed URLs and signed cookies.",
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
          description: "A key group configuration.",
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

        const command = new CreateKeyGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Key Group Result",
      description: "Result from CreateKeyGroup operation",
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
            description: "The key group that was just created.",
          },
          Location: {
            type: "string",
            description: "The URL of the key group.",
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

export default createKeyGroup;
