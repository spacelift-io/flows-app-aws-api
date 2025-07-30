import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableEbsEncryptionByDefaultCommand,
} from "@aws-sdk/client-ec2";

const disableEbsEncryptionByDefault: AppBlock = {
  name: "Disable Ebs Encryption By Default",
  description:
    "Disables EBS encryption by default for your account in the current Region.",
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
        });

        const command = new DisableEbsEncryptionByDefaultCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Ebs Encryption By Default Result",
      description: "Result from DisableEbsEncryptionByDefault operation",
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

export default disableEbsEncryptionByDefault;
