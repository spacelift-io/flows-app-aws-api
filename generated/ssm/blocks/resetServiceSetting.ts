import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ResetServiceSettingCommand } from "@aws-sdk/client-ssm";

const resetServiceSetting: AppBlock = {
  name: "Reset Service Setting",
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
            "The Amazon Resource Name (ARN) of the service setting to reset.",
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
        });

        const command = new ResetServiceSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Service Setting Result",
      description: "Result from ResetServiceSetting operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServiceSetting: {
            type: "object",
            properties: {
              SettingId: {
                type: "string",
              },
              SettingValue: {
                type: "string",
              },
              LastModifiedDate: {
                type: "string",
              },
              LastModifiedUser: {
                type: "string",
              },
              ARN: {
                type: "string",
              },
              Status: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The current, effective service setting after calling the ResetServiceSetting API operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resetServiceSetting;
