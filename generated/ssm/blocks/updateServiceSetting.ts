import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateServiceSettingCommand } from "@aws-sdk/client-ssm";

const updateServiceSetting: AppBlock = {
  name: "Update Service Setting",
  description:
    "ServiceSetting is an account-level setting for an Amazon Web Services service.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SettingId: {
          name: "Setting Id",
          description:
            "The Amazon Resource Name (ARN) of the service setting to update.",
          type: "string",
          required: true,
        },
        SettingValue: {
          name: "Setting Value",
          description: "The new value to specify for the service setting.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new UpdateServiceSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Service Setting Result",
      description: "Result from UpdateServiceSetting operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateServiceSetting;
