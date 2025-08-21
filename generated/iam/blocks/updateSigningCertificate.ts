import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UpdateSigningCertificateCommand,
} from "@aws-sdk/client-iam";

const updateSigningCertificate: AppBlock = {
  name: "Update Signing Certificate",
  description:
    "Changes the status of the specified user signing certificate from active to disabled, or vice versa.",
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
          description:
            "The name of the IAM user the signing certificate belongs to.",
          type: "string",
          required: false,
        },
        CertificateId: {
          name: "Certificate Id",
          description: "The ID of the signing certificate you want to update.",
          type: "string",
          required: true,
        },
        Status: {
          name: "Status",
          description: "The status you want to assign to the certificate.",
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

        const command = new UpdateSigningCertificateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Signing Certificate Result",
      description: "Result from UpdateSigningCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateSigningCertificate;
