import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  UpdateDocumentDefaultVersionCommand,
} from "@aws-sdk/client-ssm";

const updateDocumentDefaultVersion: AppBlock = {
  name: "Update Document Default Version",
  description: "Set the default version of a document.",
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
            "The name of a custom document that you want to set as the default version.",
          type: "string",
          required: true,
        },
        DocumentVersion: {
          name: "Document Version",
          description:
            "The version of a custom document that you want to set as the default version.",
          type: "string",
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
        });

        const command = new UpdateDocumentDefaultVersionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Document Default Version Result",
      description: "Result from UpdateDocumentDefaultVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Description: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              DefaultVersion: {
                type: "string",
              },
              DefaultVersionName: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The description of a custom document that you want to set as the default version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDocumentDefaultVersion;
