import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ListKeyRotationsCommand } from "@aws-sdk/client-kms";

const listKeyRotations: AppBlock = {
  name: "List Key Rotations",
  description:
    "Returns information about the key materials associated with the specified KMS key.",
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
          description: "Gets the key rotations for the specified KMS key.",
          type: "string",
          required: true,
        },
        IncludeKeyMaterial: {
          name: "Include Key Material",
          description:
            "Use this optional parameter to control which key materials associated with this key are listed in the response.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Use this parameter to specify the maximum number of items to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter in a subsequent request after you receive a response with truncated results.",
          type: "string",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListKeyRotationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Key Rotations Result",
      description: "Result from ListKeyRotations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Rotations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                KeyId: {
                  type: "string",
                },
                KeyMaterialId: {
                  type: "string",
                },
                KeyMaterialDescription: {
                  type: "string",
                },
                ImportState: {
                  type: "string",
                },
                KeyMaterialState: {
                  type: "string",
                },
                ExpirationModel: {
                  type: "string",
                },
                ValidTo: {
                  type: "string",
                },
                RotationDate: {
                  type: "string",
                },
                RotationType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of completed key material rotations.",
          },
          NextMarker: {
            type: "string",
            description:
              "When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.",
          },
          Truncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items in the list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listKeyRotations;
