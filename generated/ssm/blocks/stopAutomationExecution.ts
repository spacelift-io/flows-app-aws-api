import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, StopAutomationExecutionCommand } from "@aws-sdk/client-ssm";

const stopAutomationExecution: AppBlock = {
  name: "Stop Automation Execution",
  description: "Stop an Automation that is currently running.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AutomationExecutionId: {
          name: "Automation Execution Id",
          description: "The execution ID of the Automation to stop.",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description: "The stop request type.",
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

        const command = new StopAutomationExecutionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Automation Execution Result",
      description: "Result from StopAutomationExecution operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default stopAutomationExecution;
