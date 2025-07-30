import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeDocumentCommand } from "@aws-sdk/client-ssm";

const describeDocument: AppBlock = {
  name: "Describe Document",
  description:
    "Describes the specified Amazon Web Services Systems Manager document (SSM document).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the SSM document.",
          type: "string",
          required: true,
        },
        DocumentVersion: {
          name: "Document Version",
          description: "The document version for which you want information.",
          type: "string",
          required: false,
        },
        VersionName: {
          name: "Version Name",
          description:
            "An optional field specifying the version of the artifact associated with the document.",
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
        });

        const command = new DescribeDocumentCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Document Result",
      description: "Result from DescribeDocument operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Document: {
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
            description: "Information about the SSM document.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDocument;
