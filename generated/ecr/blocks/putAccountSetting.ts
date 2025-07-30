import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, PutAccountSettingCommand } from "@aws-sdk/client-ecr";

const putAccountSetting: AppBlock = {
  name: "Put Account Setting",
  description:
    "Allows you to change the basic scan type version or registry policy scope.",
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
        value: {
          name: "value",
          description: "Setting value that is specified.",
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
        });

        const command = new PutAccountSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Account Setting Result",
      description: "Result from PutAccountSetting operation",
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
            description:
              "Retrieves the value of the specified account setting.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putAccountSetting;
