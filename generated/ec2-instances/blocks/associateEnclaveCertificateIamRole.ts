import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateEnclaveCertificateIamRoleCommand,
} from "@aws-sdk/client-ec2";

const associateEnclaveCertificateIamRole: AppBlock = {
  name: "Associate Enclave Certificate Iam Role",
  description:
    "Associates an Identity and Access Management (IAM) role with an Certificate Manager (ACM) certificate.",
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
            "The ARN of the ACM certificate with which to associate the IAM role.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The ARN of the IAM role to associate with the ACM certificate.",
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

        const command = new AssociateEnclaveCertificateIamRoleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Enclave Certificate Iam Role Result",
      description: "Result from AssociateEnclaveCertificateIamRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CertificateS3BucketName: {
            type: "string",
            description:
              "The name of the Amazon S3 bucket to which the certificate was uploaded.",
          },
          CertificateS3ObjectKey: {
            type: "string",
            description:
              "The Amazon S3 object key where the certificate, certificate chain, and encrypted private key bundle are stored.",
          },
          EncryptionKmsKeyId: {
            type: "string",
            description:
              "The ID of the KMS key used to encrypt the private key of the certificate.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateEnclaveCertificateIamRole;
