import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  ListDocumentMetadataHistoryCommand,
} from "@aws-sdk/client-ssm";

const listDocumentMetadataHistory: AppBlock = {
  name: "List Document Metadata History",
  description:
    "Information about approval reviews for a version of a change template in Change Manager.",
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
          description: "The name of the change template.",
          type: "string",
          required: true,
        },
        DocumentVersion: {
          name: "Document Version",
          description: "The version of the change template.",
          type: "string",
          required: false,
        },
        Metadata: {
          name: "Metadata",
          description:
            "The type of data for which details are being requested.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
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

        const command = new ListDocumentMetadataHistoryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Document Metadata History Result",
      description: "Result from ListDocumentMetadataHistory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description: "The name of the change template.",
          },
          DocumentVersion: {
            type: "string",
            description: "The version of the change template.",
          },
          Author: {
            type: "string",
            description:
              "The user ID of the person in the organization who requested the review of the change template.",
          },
          Metadata: {
            type: "object",
            properties: {
              ReviewerResponse: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    CreateTime: {
                      type: "string",
                    },
                    UpdatedTime: {
                      type: "string",
                    },
                    ReviewStatus: {
                      type: "string",
                    },
                    Comment: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Reviewer: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Information about the response to the change template approval request.",
          },
          NextToken: {
            type: "string",
            description: "The maximum number of items to return for this call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDocumentMetadataHistory;
