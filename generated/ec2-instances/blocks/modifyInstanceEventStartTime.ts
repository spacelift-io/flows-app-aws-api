import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceEventStartTimeCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceEventStartTime: AppBlock = {
  name: "Modify Instance Event Start Time",
  description:
    "Modifies the start time for a scheduled Amazon EC2 instance event.",
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
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance with the scheduled event.",
          type: "string",
          required: true,
        },
        InstanceEventId: {
          name: "Instance Event Id",
          description:
            "The ID of the event whose date and time you are modifying.",
          type: "string",
          required: true,
        },
        NotBefore: {
          name: "Not Before",
          description: "The new date and time when the event will take place.",
          type: "string",
          required: true,
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

        const command = new ModifyInstanceEventStartTimeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Event Start Time Result",
      description: "Result from ModifyInstanceEventStartTime operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Event: {
            type: "object",
            properties: {
              InstanceEventId: {
                type: "string",
              },
              Code: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              NotAfter: {
                type: "string",
              },
              NotBefore: {
                type: "string",
              },
              NotBeforeDeadline: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the event.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceEventStartTime;
