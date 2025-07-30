import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteSigningCertificateCommand,
} from "@aws-sdk/client-iam";

const deleteSigningCertificate: AppBlock = {
  name: "Delete Signing Certificate",
  description:
    "Deletes a signing certificate associated with the specified IAM user.",
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
            "The name of the user the signing certificate belongs to.",
          type: "string",
          required: false,
        },
        CertificateId: {
          name: "Certificate Id",
          description: "The ID of the signing certificate to delete.",
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
        });

        const command = new DeleteSigningCertificateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Signing Certificate Result",
      description: "Result from DeleteSigningCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSigningCertificate;
