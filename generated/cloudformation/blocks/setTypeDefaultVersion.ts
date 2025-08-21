import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  SetTypeDefaultVersionCommand,
} from "@aws-sdk/client-cloudformation";

const setTypeDefaultVersion: AppBlock = {
  name: "Set Type Default Version",
  description: "Specify the default version of an extension.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Arn: {
          name: "Arn",
          description:
            "The Amazon Resource Name (ARN) of the extension for which you want version summary information.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description: "The kind of extension.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension.",
          type: "string",
          required: false,
        },
        VersionId: {
          name: "Version Id",
          description: "The ID of a specific version of the extension.",
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

        const command = new SetTypeDefaultVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Type Default Version Result",
      description: "Result from SetTypeDefaultVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setTypeDefaultVersion;
