import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableSerialConsoleAccessCommand,
} from "@aws-sdk/client-ec2";

const disableSerialConsoleAccess: AppBlock = {
  name: "Disable Serial Console Access",
  description:
    "Disables access to the EC2 serial console of all instances for your account.",
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
        });

        const command = new DisableSerialConsoleAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Serial Console Access Result",
      description: "Result from DisableSerialConsoleAccess operation",
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

export default disableSerialConsoleAccess;
