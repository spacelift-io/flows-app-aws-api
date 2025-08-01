import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GetParametersForImportCommand } from "@aws-sdk/client-kms";

const getParametersForImport: AppBlock = {
  name: "Get Parameters For Import",
  description:
    "Returns the public key and an import token you need to import or reimport key material for a KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description:
            "The identifier of the KMS key that will be associated with the imported key material.",
          type: "string",
          required: true,
        },
        WrappingAlgorithm: {
          name: "Wrapping Algorithm",
          description:
            "The algorithm you will use with the RSA public key (PublicKey) in the response to protect your key material during import.",
          type: "string",
          required: true,
        },
        WrappingKeySpec: {
          name: "Wrapping Key Spec",
          description: "The type of RSA public key to return in the response.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetParametersForImportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Parameters For Import Result",
      description: "Result from GetParametersForImport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key to use in a subsequent ImportKeyMaterial request.",
          },
          ImportToken: {
            type: "string",
            description:
              "The import token to send in a subsequent ImportKeyMaterial request.",
          },
          PublicKey: {
            type: "string",
            description:
              "The public key to use to encrypt the key material before importing it with ImportKeyMaterial.",
          },
          ParametersValidTo: {
            type: "string",
            description:
              "The time at which the import token and public key are no longer valid.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getParametersForImport;
