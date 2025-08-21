import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListDocumentVersionsCommand } from "@aws-sdk/client-ssm";

const listDocumentVersions: AppBlock = {
  name: "List Document Versions",
  description: "List all versions for a document.",
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
          description: "The name of the document.",
          type: "string",
          required: true,
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

        const command = new ListDocumentVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Document Versions Result",
      description: "Result from ListDocumentVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DocumentVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                DisplayName: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
                },
                VersionName: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                IsDefaultVersion: {
                  type: "boolean",
                },
                DocumentFormat: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusInformation: {
                  type: "string",
                },
                ReviewStatus: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The document versions.",
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

export default listDocumentVersions;
