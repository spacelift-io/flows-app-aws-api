import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetExecutionPreviewCommand } from "@aws-sdk/client-ssm";

const getExecutionPreview: AppBlock = {
  name: "Get Execution Preview",
  description:
    "Initiates the process of retrieving an existing preview that shows the effects that running a specified Automation runbook would have on the targeted resources.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExecutionPreviewId: {
          name: "Execution Preview Id",
          description: "The ID of the existing execution preview.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetExecutionPreviewCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Execution Preview Result",
      description: "Result from GetExecutionPreview operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExecutionPreviewId: {
            type: "string",
            description: "The generated ID for the existing execution preview.",
          },
          EndedAt: {
            type: "string",
            description:
              "A UTC timestamp indicating when the execution preview operation ended.",
          },
          Status: {
            type: "string",
            description:
              "The current status of the execution preview operation.",
          },
          StatusMessage: {
            type: "string",
            description:
              "Supplemental information about the current status of the execution preview.",
          },
          ExecutionPreview: {
            type: "string",
            description:
              "Information about the changes that would be made if an execution were run.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getExecutionPreview;
