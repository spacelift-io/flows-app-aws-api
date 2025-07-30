import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, TagMFADeviceCommand } from "@aws-sdk/client-iam";

const tagMFADevice: AppBlock = {
  name: "Tag MFA Device",
  description:
    "Adds one or more tags to an IAM virtual multi-factor authentication (MFA) device.",
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
            "The unique identifier for the IAM virtual MFA device to which you want to add tags.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of tags that you want to attach to the IAM virtual MFA device.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
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

        const command = new TagMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag MFA Device Result",
      description: "Result from TagMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagMFADevice;
