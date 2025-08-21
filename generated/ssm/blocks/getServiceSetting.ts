import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetServiceSettingCommand } from "@aws-sdk/client-ssm";

const getServiceSetting: AppBlock = {
  name: "Get Service Setting",
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
          description: "The ID of the service setting to get.",
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

        const command = new GetServiceSettingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Service Setting Result",
      description: "Result from GetServiceSetting operation",
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
            description: "The query result of the current service setting.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getServiceSetting;
