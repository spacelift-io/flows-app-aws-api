import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetEbsDefaultKmsKeyIdCommand } from "@aws-sdk/client-ec2";

const getEbsDefaultKmsKeyId: AppBlock = {
  name: "Get Ebs Default Kms Key Id",
  description:
    "Describes the default KMS key for EBS encryption by default for your account in this Region.",
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

        const command = new GetEbsDefaultKmsKeyIdCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Ebs Default Kms Key Id Result",
      description: "Result from GetEbsDefaultKmsKeyId operation",
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

export default getEbsDefaultKmsKeyId;
