import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateServerCertificateCommand } from "@aws-sdk/client-iam";

const updateServerCertificate: AppBlock = {
  name: "Update Server Certificate",
  description:
    "Updates the name and/or the path of the specified server certificate stored in IAM.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ServerCertificateName: {
          name: "Server Certificate Name",
          description:
            "The name of the server certificate that you want to update.",
          type: "string",
          required: true,
        },
        NewPath: {
          name: "New Path",
          description: "The new path for the server certificate.",
          type: "string",
          required: false,
        },
        NewServerCertificateName: {
          name: "New Server Certificate Name",
          description: "The new name for the server certificate.",
          type: "string",
          required: false,
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

        const command = new UpdateServerCertificateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Server Certificate Result",
      description: "Result from UpdateServerCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateServerCertificate;
