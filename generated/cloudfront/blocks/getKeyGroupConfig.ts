import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetKeyGroupConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getKeyGroupConfig: AppBlock = {
  name: "Get Key Group Config",
  description: "Gets a key group configuration.",
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
          description:
            "The identifier of the key group whose configuration you are getting.",
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

        const command = new GetKeyGroupConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Key Group Config Result",
      description: "Result from GetKeyGroupConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description: "The key group configuration.",
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

export default getKeyGroupConfig;
