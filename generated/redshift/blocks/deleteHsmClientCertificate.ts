import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteHsmClientCertificateCommand,
} from "@aws-sdk/client-redshift";

const deleteHsmClientCertificate: AppBlock = {
  name: "Delete Hsm Client Certificate",
  description: `Deletes the specified HSM client certificate.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HsmClientCertificateIdentifier: {
          name: "Hsm Client Certificate Identifier",
          description:
            "The identifier of the HSM client certificate to be deleted.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteHsmClientCertificateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Hsm Client Certificate Result",
      description: "Result from DeleteHsmClientCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteHsmClientCertificate;
