import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ResetEbsDefaultKmsKeyIdCommand } from "@aws-sdk/client-ec2";

const resetEbsDefaultKmsKeyId: AppBlock = {
  name: "Reset Ebs Default Kms Key Id",
  description:
    "Resets the default KMS key for EBS encryption for your account in this Region to the Amazon Web Services managed KMS key for EBS.",
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

        const command = new ResetEbsDefaultKmsKeyIdCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Ebs Default Kms Key Id Result",
      description: "Result from ResetEbsDefaultKmsKeyId operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KmsKeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the default KMS key for EBS encryption by default.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resetEbsDefaultKmsKeyId;
