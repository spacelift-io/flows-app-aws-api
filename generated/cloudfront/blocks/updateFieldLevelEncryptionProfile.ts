import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateFieldLevelEncryptionProfileCommand,
} from "@aws-sdk/client-cloudfront";

const updateFieldLevelEncryptionProfile: AppBlock = {
  name: "Update Field Level Encryption Profile",
  description: "Update a field-level encryption profile.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FieldLevelEncryptionProfileConfig: {
          name: "Field Level Encryption Profile Config",
          description: "Request to update a field-level encryption profile.",
          type: {
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
          },
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the field-level encryption profile request.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the profile identity to update.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateFieldLevelEncryptionProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Field Level Encryption Profile Result",
      description: "Result from UpdateFieldLevelEncryptionProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FieldLevelEncryptionProfile: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
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
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                },
                required: ["Name", "CallerReference", "EncryptionEntities"],
                additionalProperties: false,
              },
            },
            required: [
              "Id",
              "LastModifiedTime",
              "FieldLevelEncryptionProfileConfig",
            ],
            additionalProperties: false,
            description: "Return the results of updating the profile.",
          },
          ETag: {
            type: "string",
            description:
              "The result of the field-level encryption profile request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateFieldLevelEncryptionProfile;
