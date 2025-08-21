import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateDocumentCommand } from "@aws-sdk/client-ssm";

const updateDocument: AppBlock = {
  name: "Update Document",
  description: "Updates one or more values for an SSM document.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Content: {
          name: "Content",
          description: "A valid JSON or YAML string.",
          type: "string",
          required: true,
        },
        Attachments: {
          name: "Attachments",
          description:
            "A list of key-value pairs that describe attachments to a version of a document.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Name: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        Name: {
          name: "Name",
          description: "The name of the SSM document that you want to update.",
          type: "string",
          required: true,
        },
        DisplayName: {
          name: "Display Name",
          description:
            "The friendly name of the SSM document that you want to update.",
          type: "string",
          required: false,
        },
        VersionName: {
          name: "Version Name",
          description:
            "An optional field specifying the version of the artifact you are updating with the document.",
          type: "string",
          required: false,
        },
        DocumentVersion: {
          name: "Document Version",
          description: "The version of the document that you want to update.",
          type: "string",
          required: false,
        },
        DocumentFormat: {
          name: "Document Format",
          description:
            "Specify the document format for the new document version.",
          type: "string",
          required: false,
        },
        TargetType: {
          name: "Target Type",
          description: "Specify a new target type for the document.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new UpdateDocumentCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Document Result",
      description: "Result from UpdateDocument operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DocumentDescription: {
            type: "object",
            properties: {
              Sha1: {
                type: "string",
              },
              Hash: {
                type: "string",
              },
              HashType: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              DisplayName: {
                type: "string",
              },
              VersionName: {
                type: "string",
              },
              Owner: {
                type: "string",
              },
              CreatedDate: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              StatusInformation: {
                type: "string",
              },
              DocumentVersion: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              Parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Type: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                    DefaultValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              PlatformTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              DocumentType: {
                type: "string",
              },
              SchemaVersion: {
                type: "string",
              },
              LatestVersion: {
                type: "string",
              },
              DefaultVersion: {
                type: "string",
              },
              DocumentFormat: {
                type: "string",
              },
              TargetType: {
                type: "string",
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
              AttachmentsInformation: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Requires: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Version: {
                      type: "string",
                    },
                    RequireType: {
                      type: "string",
                    },
                    VersionName: {
                      type: "string",
                    },
                  },
                  required: ["Name"],
                  additionalProperties: false,
                },
              },
              Author: {
                type: "string",
              },
              ReviewInformation: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ReviewedTime: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    Reviewer: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ApprovedVersion: {
                type: "string",
              },
              PendingReviewVersion: {
                type: "string",
              },
              ReviewStatus: {
                type: "string",
              },
              Category: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              CategoryEnum: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "A description of the document that was updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDocument;
