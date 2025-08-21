import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketInventoryConfigurationCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putBucketInventoryConfiguration: AppBlock = {
  name: "Put Bucket Inventory Configuration",
  description: "This operation is not supported for directory buckets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description:
            "The name of the bucket where the inventory configuration will be stored.",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID used to identify the inventory configuration.",
          type: "string",
          required: true,
        },
        InventoryConfiguration: {
          name: "Inventory Configuration",
          description: "Specifies the inventory configuration.",
          type: {
            type: "object",
            properties: {
              Destination: {
                type: "object",
                properties: {
                  S3BucketDestination: {
                    type: "object",
                    properties: {
                      AccountId: {
                        type: "string",
                      },
                      Bucket: {
                        type: "string",
                      },
                      Format: {
                        type: "string",
                      },
                      Prefix: {
                        type: "string",
                      },
                      Encryption: {
                        type: "object",
                        properties: {
                          SSES3: {
                            type: "object",
                            additionalProperties: true,
                          },
                          SSEKMS: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: false,
                      },
                    },
                    required: ["Bucket", "Format"],
                    additionalProperties: false,
                  },
                },
                required: ["S3BucketDestination"],
                additionalProperties: false,
              },
              IsEnabled: {
                type: "boolean",
              },
              Filter: {
                type: "object",
                properties: {
                  Prefix: {
                    type: "string",
                  },
                },
                required: ["Prefix"],
                additionalProperties: false,
              },
              Id: {
                type: "string",
              },
              IncludedObjectVersions: {
                type: "string",
              },
              OptionalFields: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Schedule: {
                type: "object",
                properties: {
                  Frequency: {
                    type: "string",
                  },
                },
                required: ["Frequency"],
                additionalProperties: false,
              },
            },
            required: [
              "Destination",
              "IsEnabled",
              "Id",
              "IncludedObjectVersions",
              "Schedule",
            ],
            additionalProperties: false,
          },
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new S3Client({
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

        const command = new PutBucketInventoryConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Inventory Configuration Result",
      description: "Result from PutBucketInventoryConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketInventoryConfiguration;
