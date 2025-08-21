import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  SetTypeConfigurationCommand,
} from "@aws-sdk/client-cloudformation";

const setTypeConfiguration: AppBlock = {
  name: "Set Type Configuration",
  description:
    "Specifies the configuration data for a registered CloudFormation extension, in the given account and Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeArn: {
          name: "Type Arn",
          description:
            "The Amazon Resource Name (ARN) for the extension, in this account and Region.",
          type: "string",
          required: false,
        },
        Configuration: {
          name: "Configuration",
          description:
            "The configuration data for the extension, in this account and Region.",
          type: "string",
          required: true,
        },
        ConfigurationAlias: {
          name: "Configuration Alias",
          description:
            "An alias by which to refer to this extension configuration data.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description: "The type of extension.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new SetTypeConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Type Configuration Result",
      description: "Result from SetTypeConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConfigurationArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) for the configuration data, in this account and Region.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default setTypeConfiguration;
