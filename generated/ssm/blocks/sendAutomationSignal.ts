import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, SendAutomationSignalCommand } from "@aws-sdk/client-ssm";

const sendAutomationSignal: AppBlock = {
  name: "Send Automation Signal",
  description:
    "Sends a signal to an Automation execution to change the current behavior or status of the execution.",
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
          description:
            "The unique identifier for an existing Automation execution that you want to send the signal to.",
          type: "string",
          required: true,
        },
        SignalType: {
          name: "Signal Type",
          description: "The type of signal to send to an Automation execution.",
          type: "string",
          required: true,
        },
        Payload: {
          name: "Payload",
          description: "The data sent with the signal.",
          type: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
          },
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

        const command = new SendAutomationSignalCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Automation Signal Result",
      description: "Result from SendAutomationSignal operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default sendAutomationSignal;
