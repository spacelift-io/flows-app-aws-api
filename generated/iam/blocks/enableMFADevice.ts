import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, EnableMFADeviceCommand } from "@aws-sdk/client-iam";

const enableMFADevice: AppBlock = {
  name: "Enable MFA Device",
  description:
    "Enables the specified MFA device and associates it with the specified IAM user.",
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
            "The name of the IAM user for whom you want to enable the MFA device.",
          type: "string",
          required: true,
        },
        SerialNumber: {
          name: "Serial Number",
          description:
            "The serial number that uniquely identifies the MFA device.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new EnableMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable MFA Device Result",
      description: "Result from EnableMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default enableMFADevice;
