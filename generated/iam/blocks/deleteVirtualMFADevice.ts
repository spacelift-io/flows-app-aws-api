import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteVirtualMFADeviceCommand } from "@aws-sdk/client-iam";

const deleteVirtualMFADevice: AppBlock = {
  name: "Delete Virtual MFA Device",
  description: "Deletes a virtual MFA device.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new DeleteVirtualMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Virtual MFA Device Result",
      description: "Result from DeleteVirtualMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteVirtualMFADevice;
