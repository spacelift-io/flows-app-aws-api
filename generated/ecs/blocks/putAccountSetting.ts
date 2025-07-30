import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, PutAccountSettingCommand } from "@aws-sdk/client-ecs";

const putAccountSetting: AppBlock = {
  name: "Put Account Setting",
  description: "Modifies an account setting.",
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
          description: "The Amazon ECS account setting name to modify.",
          type: "string",
          required: true,
        },
        value: {
          name: "value",
          description:
            "The account setting value for the specified principal ARN.",
          type: "string",
          required: true,
        },
        principalArn: {
          name: "principal Arn",
          description:
            "The ARN of the principal, which can be a user, role, or the root user.",
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
            description: "The current account setting for a resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putAccountSetting;
