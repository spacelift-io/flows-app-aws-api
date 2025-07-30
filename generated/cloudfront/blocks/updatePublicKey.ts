import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdatePublicKeyCommand,
} from "@aws-sdk/client-cloudfront";

const updatePublicKey: AppBlock = {
  name: "Update Public Key",
  description: "Update public key information.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PublicKeyConfig: {
          name: "Public Key Config",
          description: "A public key configuration.",
          type: {
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
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The identifier of the public key that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the public key to update.",
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

        const command = new UpdatePublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Public Key Result",
      description: "Result from UpdatePublicKey operation",
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
            description:
              "The identifier of the current version of the public key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updatePublicKey;
