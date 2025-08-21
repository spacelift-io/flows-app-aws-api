import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreatePublicKeyCommand,
} from "@aws-sdk/client-cloudfront";

const createPublicKey: AppBlock = {
  name: "Create Public Key",
  description:
    "Uploads a public key to CloudFront that you can use with signed URLs and signed cookies, or with field-level encryption.",
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
          description: "A CloudFront public key configuration.",
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

        const command = new CreatePublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Public Key Result",
      description: "Result from CreatePublicKey operation",
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
          Location: {
            type: "string",
            description: "The URL of the public key.",
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

export default createPublicKey;
