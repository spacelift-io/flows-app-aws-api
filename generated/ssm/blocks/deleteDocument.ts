import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteDocumentCommand } from "@aws-sdk/client-ssm";

const deleteDocument: AppBlock = {
  name: "Delete Document",
  description:
    "Deletes the Amazon Web Services Systems Manager document (SSM document) and all managed node associations to the document.",
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
        DocumentVersion: {
          name: "Document Version",
          description: "The version of the document that you want to delete.",
          type: "string",
          required: false,
        },
        VersionName: {
          name: "Version Name",
          description:
            "The version name of the document that you want to delete.",
          type: "string",
          required: false,
        },
        Force: {
          name: "Force",
          description:
            "Some SSM document types require that you specify a Force flag before you can delete the document.",
          type: "boolean",
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

        const command = new DeleteDocumentCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Document Result",
      description: "Result from DeleteDocument operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteDocument;
