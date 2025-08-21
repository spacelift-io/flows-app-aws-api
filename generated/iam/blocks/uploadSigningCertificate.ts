import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UploadSigningCertificateCommand,
} from "@aws-sdk/client-iam";

const uploadSigningCertificate: AppBlock = {
  name: "Upload Signing Certificate",
  description: "Uploads an X.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user the signing certificate is for.",
          type: "string",
          required: false,
        },
        CertificateBody: {
          name: "Certificate Body",
          description: "The contents of the signing certificate.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new UploadSigningCertificateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Upload Signing Certificate Result",
      description: "Result from UploadSigningCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Certificate: {
            type: "object",
            properties: {
              UserName: {
                type: "string",
              },
              CertificateId: {
                type: "string",
              },
              CertificateBody: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              UploadDate: {
                type: "string",
              },
            },
            required: [
              "UserName",
              "CertificateId",
              "CertificateBody",
              "Status",
            ],
            additionalProperties: false,
            description: "Information about the certificate.",
          },
        },
        required: ["Certificate"],
      },
    },
  },
};

export default uploadSigningCertificate;
