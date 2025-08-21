import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListFieldLevelEncryptionConfigsCommand,
} from "@aws-sdk/client-cloudfront";

const listFieldLevelEncryptionConfigs: AppBlock = {
  name: "List Field Level Encryption Configs",
  description:
    "List all field-level encryption configurations that have been created in CloudFront for this account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this when paginating results to indicate where to begin in your list of configurations.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of field-level encryption configurations you want in the response body.",
          type: "number",
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

        const command = new ListFieldLevelEncryptionConfigsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Field Level Encryption Configs Result",
      description: "Result from ListFieldLevelEncryptionConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FieldLevelEncryptionList: {
            type: "object",
            properties: {
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    LastModifiedTime: {
                      type: "string",
                    },
                    Comment: {
                      type: "string",
                    },
                    QueryArgProfileConfig: {
                      type: "object",
                      properties: {
                        ForwardWhenQueryArgProfileIsUnknown: {
                          type: "object",
                          additionalProperties: true,
                        },
                        QueryArgProfiles: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["ForwardWhenQueryArgProfileIsUnknown"],
                      additionalProperties: false,
                    },
                    ContentTypeProfileConfig: {
                      type: "object",
                      properties: {
                        ForwardWhenContentTypeIsUnknown: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ContentTypeProfiles: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["ForwardWhenContentTypeIsUnknown"],
                      additionalProperties: false,
                    },
                  },
                  required: ["Id", "LastModifiedTime"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description:
              "Returns a list of all field-level encryption configurations that have been created in CloudFront for this account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listFieldLevelEncryptionConfigs;
