import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateFieldLevelEncryptionConfigCommand,
} from "@aws-sdk/client-cloudfront";

const createFieldLevelEncryptionConfig: AppBlock = {
  name: "Create Field Level Encryption Config",
  description: "Create a new field-level encryption configuration.",
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
            "The request to create a new field-level encryption configuration.",
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

        const command = new CreateFieldLevelEncryptionConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Field Level Encryption Config Result",
      description: "Result from CreateFieldLevelEncryptionConfig operation",
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
            description:
              "Returned when you create a new field-level encryption configuration.",
          },
          Location: {
            type: "string",
            description:
              "The fully qualified URI of the new configuration resource just created.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the field level encryption configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createFieldLevelEncryptionConfig;
