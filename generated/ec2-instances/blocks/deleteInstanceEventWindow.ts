import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteInstanceEventWindowCommand,
} from "@aws-sdk/client-ec2";

const deleteInstanceEventWindow: AppBlock = {
  name: "Delete Instance Event Window",
  description: "Deletes the specified event window.",
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
        ForceDelete: {
          name: "Force Delete",
          description: "Specify true to force delete the event window.",
          type: "boolean",
          required: false,
        },
        InstanceEventWindowId: {
          name: "Instance Event Window Id",
          description: "The ID of the event window.",
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
        });

        const command = new DeleteInstanceEventWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Instance Event Window Result",
      description: "Result from DeleteInstanceEventWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceEventWindowState: {
            type: "object",
            properties: {
              InstanceEventWindowId: {
                type: "string",
              },
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The state of the event window.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteInstanceEventWindow;
