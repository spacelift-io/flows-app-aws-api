import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableEbsEncryptionByDefaultCommand,
} from "@aws-sdk/client-ec2";

const enableEbsEncryptionByDefault: AppBlock = {
  name: "Enable Ebs Encryption By Default",
  description:
    "Enables EBS encryption by default for your account in the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new EnableEbsEncryptionByDefaultCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Ebs Encryption By Default Result",
      description: "Result from EnableEbsEncryptionByDefault operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EbsEncryptionByDefault: {
            type: "boolean",
            description: "The updated status of encryption by default.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableEbsEncryptionByDefault;
