import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, DeleteAccountSettingCommand } from "@aws-sdk/client-ecs";

const deleteAccountSetting: AppBlock = {
  name: "Delete Account Setting",
  description:
    "Disables an account setting for a specified user, role, or the root user for an account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description: "The resource name to disable the account setting for.",
          type: "string",
          required: true,
        },
        principalArn: {
          name: "principal Arn",
          description: "The Amazon Resource Name (ARN) of the principal.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
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

        const command = new DeleteAccountSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Account Setting Result",
      description: "Result from DeleteAccountSetting operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          setting: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              value: {
                type: "string",
              },
              principalArn: {
                type: "string",
              },
              type: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The account setting for the specified principal ARN.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteAccountSetting;
