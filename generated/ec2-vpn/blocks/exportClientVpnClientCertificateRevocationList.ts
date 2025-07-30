import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ExportClientVpnClientCertificateRevocationListCommand,
} from "@aws-sdk/client-ec2";

const exportClientVpnClientCertificateRevocationList: AppBlock = {
  name: "Export Client Vpn Client Certificate Revocation List",
  description:
    "Downloads the client certificate revocation list for the specified Client VPN endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientVpnEndpointId: {
          name: "Client Vpn Endpoint Id",
          description: "The ID of the Client VPN endpoint.",
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

        const command =
          new ExportClientVpnClientCertificateRevocationListCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Export Client Vpn Client Certificate Revocation List Result",
      description:
        "Result from ExportClientVpnClientCertificateRevocationList operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CertificateRevocationList: {
            type: "string",
            description:
              "Information about the client certificate revocation list.",
          },
          Status: {
            type: "object",
            properties: {
              Code: {
                type: "string",
              },
              Message: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The current state of the client certificate revocation list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default exportClientVpnClientCertificateRevocationList;
