import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetPublicKeyCommand,
} from "@aws-sdk/client-cloudfront";

const getPublicKey: AppBlock = {
  name: "Get Public Key",
  description: "Gets a public key.",
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
          description: "The identifier of the public key you are getting.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetPublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Public Key Result",
      description: "Result from GetPublicKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicKey: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              CreatedTime: {
                type: "string",
              },
              PublicKeyConfig: {
                type: "object",
                properties: {
                  CallerReference: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                  EncodedKey: {
                    type: "string",
                  },
                  Comment: {
                    type: "string",
                  },
                },
                required: ["CallerReference", "Name", "EncodedKey"],
                additionalProperties: false,
              },
            },
            required: ["Id", "CreatedTime", "PublicKeyConfig"],
            additionalProperties: false,
            description: "The public key.",
          },
          ETag: {
            type: "string",
            description: "The identifier for this version of the public key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPublicKey;
