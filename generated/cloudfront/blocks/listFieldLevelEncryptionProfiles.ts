import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListFieldLevelEncryptionProfilesCommand,
} from "@aws-sdk/client-cloudfront";

const listFieldLevelEncryptionProfiles: AppBlock = {
  name: "List Field Level Encryption Profiles",
  description:
    "Request a list of field-level encryption profiles that have been created in CloudFront for this account.",
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
            "Use this when paginating results to indicate where to begin in your list of profiles.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of field-level encryption profiles you want in the response body.",
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
        });

        const command = new ListFieldLevelEncryptionProfilesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Field Level Encryption Profiles Result",
      description: "Result from ListFieldLevelEncryptionProfiles operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FieldLevelEncryptionProfileList: {
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
                    Name: {
                      type: "string",
                    },
                    EncryptionEntities: {
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
                    Comment: {
                      type: "string",
                    },
                  },
                  required: [
                    "Id",
                    "LastModifiedTime",
                    "Name",
                    "EncryptionEntities",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description:
              "Returns a list of the field-level encryption profiles that have been created in CloudFront for this account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listFieldLevelEncryptionProfiles;
