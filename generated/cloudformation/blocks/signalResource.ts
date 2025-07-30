import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  SignalResourceCommand,
} from "@aws-sdk/client-cloudformation";

const signalResource: AppBlock = {
  name: "Signal Resource",
  description:
    "Sends a signal to the specified resource with a success or failure status.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The stack name or unique stack ID that includes the resource that you want to signal.",
          type: "string",
          required: true,
        },
        LogicalResourceId: {
          name: "Logical Resource Id",
          description:
            "The logical ID of the resource that you want to signal.",
          type: "string",
          required: true,
        },
        UniqueId: {
          name: "Unique Id",
          description: "A unique ID of the signal.",
          type: "string",
          required: true,
        },
        Status: {
          name: "Status",
          description:
            "The status of the signal, which is either success or failure.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new SignalResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Signal Resource Result",
      description: "Result from SignalResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default signalResource;
