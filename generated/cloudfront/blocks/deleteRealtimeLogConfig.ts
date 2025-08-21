import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteRealtimeLogConfigCommand,
} from "@aws-sdk/client-cloudfront";

const deleteRealtimeLogConfig: AppBlock = {
  name: "Delete Realtime Log Config",
  description: "Deletes a real-time log configuration.",
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
          description: "The name of the real-time log configuration to delete.",
          type: "string",
          required: false,
        },
        ARN: {
          name: "ARN",
          description:
            "The Amazon Resource Name (ARN) of the real-time log configuration to delete.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new DeleteRealtimeLogConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Realtime Log Config Result",
      description: "Result from DeleteRealtimeLogConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRealtimeLogConfig;
