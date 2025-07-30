import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetConsoleOutputCommand } from "@aws-sdk/client-ec2";

const getConsoleOutput: AppBlock = {
  name: "Get Console Output",
  description: "Gets the console output for the specified instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        Latest: {
          name: "Latest",
          description:
            "When enabled, retrieves the latest console output for the instance.",
          type: "boolean",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
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
        });

        const command = new GetConsoleOutputCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Console Output Result",
      description: "Result from GetConsoleOutput operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the instance.",
          },
          Timestamp: {
            type: "string",
            description: "The time at which the output was last updated.",
          },
          Output: {
            type: "string",
            description: "The console output, base64-encoded.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getConsoleOutput;
