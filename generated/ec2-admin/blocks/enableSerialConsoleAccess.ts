import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableSerialConsoleAccessCommand,
} from "@aws-sdk/client-ec2";

const enableSerialConsoleAccess: AppBlock = {
  name: "Enable Serial Console Access",
  description:
    "Enables access to the EC2 serial console of all instances for your account.",
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

        const command = new EnableSerialConsoleAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Serial Console Access Result",
      description: "Result from EnableSerialConsoleAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SerialConsoleAccessEnabled: {
            type: "boolean",
            description:
              "If true, access to the EC2 serial console of all instances is enabled for your account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableSerialConsoleAccess;
