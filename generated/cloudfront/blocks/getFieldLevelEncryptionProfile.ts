import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetFieldLevelEncryptionProfileCommand,
} from "@aws-sdk/client-cloudfront";

const getFieldLevelEncryptionProfile: AppBlock = {
  name: "Get Field Level Encryption Profile",
  description: "Get the field-level encryption profile information.",
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
            "Get the ID for the field-level encryption profile information.",
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

        const command = new GetFieldLevelEncryptionProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Field Level Encryption Profile Result",
      description: "Result from GetFieldLevelEncryptionProfile operation",
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
            description:
              "Return the field-level encryption profile information.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the field level encryption profile.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFieldLevelEncryptionProfile;
