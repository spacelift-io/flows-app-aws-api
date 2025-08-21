import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetFieldLevelEncryptionCommand,
} from "@aws-sdk/client-cloudfront";

const getFieldLevelEncryption: AppBlock = {
  name: "Get Field Level Encryption",
  description: "Get the field-level encryption configuration information.",
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
            "Request the ID for the field-level encryption configuration information.",
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

        const command = new GetFieldLevelEncryptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Field Level Encryption Result",
      description: "Result from GetFieldLevelEncryption operation",
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
              "Return the field-level encryption configuration information.",
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

export default getFieldLevelEncryption;
