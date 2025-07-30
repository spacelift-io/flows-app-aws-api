import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ResyncMFADeviceCommand } from "@aws-sdk/client-iam";

const resyncMFADevice: AppBlock = {
  name: "Resync MFA Device",
  description:
    "Synchronizes the specified MFA device with its IAM resource object on the Amazon Web Services servers.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name of the user whose MFA device you want to resynchronize.",
          type: "string",
          required: true,
        },
        SerialNumber: {
          name: "Serial Number",
          description: "Serial number that uniquely identifies the MFA device.",
          type: "string",
          required: true,
        },
        AuthenticationCode1: {
          name: "Authentication Code1",
          description: "An authentication code emitted by the device.",
          type: "string",
          required: true,
        },
        AuthenticationCode2: {
          name: "Authentication Code2",
          description:
            "A subsequent authentication code emitted by the device.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ResyncMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Resync MFA Device Result",
      description: "Result from ResyncMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default resyncMFADevice;
