import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateDocumentMetadataCommand } from "@aws-sdk/client-ssm";

const updateDocumentMetadata: AppBlock = {
  name: "Update Document Metadata",
  description:
    "Updates information related to approval reviews for a specific version of a change template in Change Manager.",
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
          description:
            "The name of the change template for which a version's metadata is to be updated.",
          type: "string",
          required: true,
        },
        DocumentVersion: {
          name: "Document Version",
          description:
            "The version of a change template in which to update approval metadata.",
          type: "string",
          required: false,
        },
        DocumentReviews: {
          name: "Document Reviews",
          description: "The change template review details to update.",
          type: {
            type: "object",
            properties: {
              Action: {
                type: "string",
              },
              Comment: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Content: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            required: ["Action"],
            additionalProperties: false,
          },
          required: true,
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

        const command = new UpdateDocumentMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Document Metadata Result",
      description: "Result from UpdateDocumentMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateDocumentMetadata;
