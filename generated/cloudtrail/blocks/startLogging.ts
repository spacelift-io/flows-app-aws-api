import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StartLoggingCommand,
} from "@aws-sdk/client-cloudtrail";

const startLogging: AppBlock = {
  name: "Start Logging",
  description:
    "Starts the recording of Amazon Web Services API calls and log file delivery for a trail.",
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
            "Specifies the name or the CloudTrail ARN of the trail for which CloudTrail logs Amazon Web Services API calls.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new StartLoggingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Logging Result",
      description: "Result from StartLogging operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default startLogging;
