import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CancelConversionTaskCommand } from "@aws-sdk/client-ec2";

const cancelConversionTask: AppBlock = {
  name: "Cancel Conversion Task",
  description: "Cancels an active conversion task.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ConversionTaskId: {
          name: "Conversion Task Id",
          description: "The ID of the conversion task.",
          type: "string",
          required: true,
        },
        ReasonMessage: {
          name: "Reason Message",
          description: "The reason for canceling the conversion task.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new CancelConversionTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Conversion Task Result",
      description: "Result from CancelConversionTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default cancelConversionTask;
