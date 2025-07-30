import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DeactivateTypeCommand,
} from "@aws-sdk/client-cloudformation";

const deactivateType: AppBlock = {
  name: "Deactivate Type",
  description:
    "Deactivates a public extension that was previously activated in this account and Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeName: {
          name: "Type Name",
          description:
            "The type name of the extension, in this account and Region.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description: "The extension type.",
          type: "string",
          required: false,
        },
        Arn: {
          name: "Arn",
          description:
            "The Amazon Resource Name (ARN) for the extension, in this account and Region.",
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
        });

        const command = new DeactivateTypeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deactivate Type Result",
      description: "Result from DeactivateType operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deactivateType;
