import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListDocumentsCommand } from "@aws-sdk/client-ssm";

const listDocuments: AppBlock = {
  name: "List Documents",
  description:
    "Returns all Systems Manager (SSM) documents in the current Amazon Web Services account and Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DocumentFilterList: {
          name: "Document Filter List",
          description: "This data type is deprecated.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more DocumentKeyValuesFilter objects.",
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
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
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

        const command = new ListDocumentsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Documents Result",
      description: "Result from ListDocuments operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DocumentIdentifiers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                DisplayName: {
                  type: "string",
                },
                Owner: {
                  type: "string",
                },
                VersionName: {
                  type: "string",
                },
                PlatformTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                DocumentVersion: {
                  type: "string",
                },
                DocumentType: {
                  type: "string",
                },
                SchemaVersion: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Key", "Value"],
                    additionalProperties: false,
                  },
                },
                Requires: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Version: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RequireType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VersionName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name"],
                    additionalProperties: false,
                  },
                },
                ReviewStatus: {
                  type: "string",
                },
                Author: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The names of the SSM documents.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDocuments;
