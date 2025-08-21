import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, GetAccountSettingCommand } from "@aws-sdk/client-ecr";

const getAccountSetting: AppBlock = {
  name: "Get Account Setting",
  description:
    "Retrieves the account setting value for the specified setting name.",
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
          description:
            "The name of the account setting, such as BASIC_SCAN_TYPE_VERSION or REGISTRY_POLICY_SCOPE.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECRClient({
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

        const command = new GetAccountSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Setting Result",
      description: "Result from GetAccountSetting operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Retrieves the name of the account setting.",
          },
          value: {
            type: "string",
            description: "The setting value for the setting name.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccountSetting;
