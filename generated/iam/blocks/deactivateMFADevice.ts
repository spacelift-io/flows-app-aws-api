import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeactivateMFADeviceCommand } from "@aws-sdk/client-iam";

const deactivateMFADevice: AppBlock = {
  name: "Deactivate MFA Device",
  description:
    "Deactivates the specified MFA device and removes it from association with the user name for which it was originally enabled.",
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
            "The name of the user whose MFA device you want to deactivate.",
          type: "string",
          required: false,
        },
        SerialNumber: {
          name: "Serial Number",
          description:
            "The serial number that uniquely identifies the MFA device.",
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

        const command = new DeactivateMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deactivate MFA Device Result",
      description: "Result from DeactivateMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deactivateMFADevice;
