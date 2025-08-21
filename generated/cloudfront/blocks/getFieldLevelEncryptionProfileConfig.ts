import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetFieldLevelEncryptionProfileConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getFieldLevelEncryptionProfileConfig: AppBlock = {
  name: "Get Field Level Encryption Profile Config",
  description:
    "Get the field-level encryption profile configuration information.",
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
            "Get the ID for the field-level encryption profile configuration information.",
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

        const command = new GetFieldLevelEncryptionProfileConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Field Level Encryption Profile Config Result",
      description: "Result from GetFieldLevelEncryptionProfileConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FieldLevelEncryptionProfileConfig: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              CallerReference: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
              EncryptionEntities: {
                type: "object",
                properties: {
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        PublicKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ProviderId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        FieldPatterns: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["PublicKeyId", "ProviderId", "FieldPatterns"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["Quantity"],
                additionalProperties: false,
              },
            },
            required: ["Name", "CallerReference", "EncryptionEntities"],
            additionalProperties: false,
            description:
              "Return the field-level encryption profile configuration information.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the field-level encryption profile configuration result.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFieldLevelEncryptionProfileConfig;
