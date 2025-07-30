import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetAssociatedEnclaveCertificateIamRolesCommand,
} from "@aws-sdk/client-ec2";

const getAssociatedEnclaveCertificateIamRoles: AppBlock = {
  name: "Get Associated Enclave Certificate Iam Roles",
  description:
    "Returns the IAM roles that are associated with the specified ACM (ACM) certificate.",
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
            "The ARN of the ACM certificate for which to view the associated IAM roles, encryption keys, and Amazon S3 object information.",
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

        const command = new GetAssociatedEnclaveCertificateIamRolesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Associated Enclave Certificate Iam Roles Result",
      description:
        "Result from GetAssociatedEnclaveCertificateIamRoles operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociatedRoles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociatedRoleArn: {
                  type: "string",
                },
                CertificateS3BucketName: {
                  type: "string",
                },
                CertificateS3ObjectKey: {
                  type: "string",
                },
                EncryptionKmsKeyId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the associated IAM roles.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAssociatedEnclaveCertificateIamRoles;
