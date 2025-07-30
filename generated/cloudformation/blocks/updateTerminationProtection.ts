import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  UpdateTerminationProtectionCommand,
} from "@aws-sdk/client-cloudformation";

const updateTerminationProtection: AppBlock = {
  name: "Update Termination Protection",
  description: "Updates termination protection for the specified stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EnableTerminationProtection: {
          name: "Enable Termination Protection",
          description:
            "Whether to enable termination protection on the specified stack.",
          type: "boolean",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The name or unique ID of the stack for which you want to set termination protection.",
          type: "string",
          required: true,
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

        const command = new UpdateTerminationProtectionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Termination Protection Result",
      description: "Result from UpdateTerminationProtection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackId: {
            type: "string",
            description: "The unique ID of the stack.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateTerminationProtection;
