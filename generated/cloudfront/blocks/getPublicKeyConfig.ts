import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetPublicKeyConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getPublicKeyConfig: AppBlock = {
  name: "Get Public Key Config",
  description: "Gets a public key configuration.",
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
            "The identifier of the public key whose configuration you are getting.",
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

        const command = new GetPublicKeyConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Public Key Config Result",
      description: "Result from GetPublicKeyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description: "A public key configuration.",
          },
          ETag: {
            type: "string",
            description:
              "The identifier for this version of the public key configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPublicKeyConfig;
