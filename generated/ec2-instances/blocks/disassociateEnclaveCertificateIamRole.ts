import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateEnclaveCertificateIamRoleCommand,
} from "@aws-sdk/client-ec2";

const disassociateEnclaveCertificateIamRole: AppBlock = {
  name: "Disassociate Enclave Certificate Iam Role",
  description:
    "Disassociates an IAM role from an Certificate Manager (ACM) certificate.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CertificateArn: {
          name: "Certificate Arn",
          description:
            "The ARN of the ACM certificate from which to disassociate the IAM role.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description: "The ARN of the IAM role to disassociate.",
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

        const command = new DisassociateEnclaveCertificateIamRoleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Enclave Certificate Iam Role Result",
      description:
        "Result from DisassociateEnclaveCertificateIamRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateEnclaveCertificateIamRole;
