import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetKeyGroupCommand,
} from "@aws-sdk/client-cloudfront";

const getKeyGroup: AppBlock = {
  name: "Get Key Group",
  description:
    "Gets a key group, including the date and time when the key group was last modified.",
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
          description: "The identifier of the key group that you are getting.",
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

        const command = new GetKeyGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Key Group Result",
      description: "Result from GetKeyGroup operation",
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
            description: "The key group.",
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

export default getKeyGroup;
