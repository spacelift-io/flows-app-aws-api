import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetConsoleScreenshotCommand } from "@aws-sdk/client-ec2";

const getConsoleScreenshot: AppBlock = {
  name: "Get Console Screenshot",
  description:
    "Retrieve a JPG-format screenshot of a running instance to help with troubleshooting.",
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
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        WakeUp: {
          name: "Wake Up",
          description:
            'When set to true, acts as keystroke input and wakes up an instance that\'s in standby or "sleep" mode.',
          type: "boolean",
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

        const command = new GetConsoleScreenshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Console Screenshot Result",
      description: "Result from GetConsoleScreenshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImageData: {
            type: "string",
            description: "The data that comprises the image.",
          },
          InstanceId: {
            type: "string",
            description: "The ID of the instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getConsoleScreenshot;
