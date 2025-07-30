import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateFieldLevelEncryptionConfigCommand,
} from "@aws-sdk/client-cloudfront";

const updateFieldLevelEncryptionConfig: AppBlock = {
  name: "Update Field Level Encryption Config",
  description: "Update a field-level encryption configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FieldLevelEncryptionConfig: {
          name: "Field Level Encryption Config",
          description:
            "Request to update a field-level encryption configuration.",
          type: {
            type: "object",
            properties: {
              CallerReference: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
              QueryArgProfileConfig: {
                type: "object",
                properties: {
                  ForwardWhenQueryArgProfileIsUnknown: {
                    type: "boolean",
                  },
                  QueryArgProfiles: {
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
                required: ["ForwardWhenQueryArgProfileIsUnknown"],
                additionalProperties: false,
              },
              ContentTypeProfileConfig: {
                type: "object",
                properties: {
                  ForwardWhenContentTypeIsUnknown: {
                    type: "boolean",
                  },
                  ContentTypeProfiles: {
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
                required: ["ForwardWhenContentTypeIsUnknown"],
                additionalProperties: false,
              },
            },
            required: ["CallerReference"],
            additionalProperties: false,
          },
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the configuration you want to update.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the configuration identity to update.",
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

        const command = new UpdateFieldLevelEncryptionConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Field Level Encryption Config Result",
      description: "Result from UpdateFieldLevelEncryptionConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FieldLevelEncryption: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              FieldLevelEncryptionConfig: {
                type: "object",
                properties: {
                  CallerReference: {
                    type: "string",
                  },
                  Comment: {
                    type: "string",
                  },
                  QueryArgProfileConfig: {
                    type: "object",
                    properties: {
                      ForwardWhenQueryArgProfileIsUnknown: {
                        type: "boolean",
                      },
                      QueryArgProfiles: {
                        type: "object",
                        properties: {
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Quantity"],
                        additionalProperties: false,
                      },
                    },
                    required: ["ForwardWhenQueryArgProfileIsUnknown"],
                    additionalProperties: false,
                  },
                  ContentTypeProfileConfig: {
                    type: "object",
                    properties: {
                      ForwardWhenContentTypeIsUnknown: {
                        type: "boolean",
                      },
                      ContentTypeProfiles: {
                        type: "object",
                        properties: {
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Quantity"],
                        additionalProperties: false,
                      },
                    },
                    required: ["ForwardWhenContentTypeIsUnknown"],
                    additionalProperties: false,
                  },
                },
                required: ["CallerReference"],
                additionalProperties: false,
              },
            },
            required: ["Id", "LastModifiedTime", "FieldLevelEncryptionConfig"],
            additionalProperties: false,
            description: "Return the results of updating the configuration.",
          },
          ETag: {
            type: "string",
            description:
              "The value of the ETag header that you received when updating the configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateFieldLevelEncryptionConfig;
