import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  PutAccountSettingDefaultCommand,
} from "@aws-sdk/client-ecs";

const putAccountSettingDefault: AppBlock = {
  name: "Put Account Setting Default",
  description:
    "Modifies an account setting for all users on an account for whom no individual account setting has been specified.",
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
            "The resource name for which to modify the account setting.",
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

        const command = new PutAccountSettingDefaultCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Account Setting Default Result",
      description: "Result from PutAccountSettingDefault operation",
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
            description: "The current setting for a resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putAccountSettingDefault;
