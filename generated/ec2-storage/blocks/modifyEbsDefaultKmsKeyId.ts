import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyEbsDefaultKmsKeyIdCommand,
} from "@aws-sdk/client-ec2";

const modifyEbsDefaultKmsKeyId: AppBlock = {
  name: "Modify Ebs Default Kms Key Id",
  description:
    "Changes the default KMS key for EBS encryption by default for your account in this Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The identifier of the KMS key to use for Amazon EBS encryption.",
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

        const command = new ModifyEbsDefaultKmsKeyIdCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Ebs Default Kms Key Id Result",
      description: "Result from ModifyEbsDefaultKmsKeyId operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KmsKeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the default KMS key for encryption by default.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyEbsDefaultKmsKeyId;
