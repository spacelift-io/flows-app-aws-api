import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ImportClientVpnClientCertificateRevocationListCommand,
} from "@aws-sdk/client-ec2";

const importClientVpnClientCertificateRevocationList: AppBlock = {
  name: "Import Client Vpn Client Certificate Revocation List",
  description:
    "Uploads a client certificate revocation list to the specified Client VPN endpoint.",
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
          description:
            "The ID of the Client VPN endpoint to which the client certificate revocation list applies.",
          type: "string",
          required: true,
        },
        CertificateRevocationList: {
          name: "Certificate Revocation List",
          description: "The client certificate revocation list file.",
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

        const command =
          new ImportClientVpnClientCertificateRevocationListCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Import Client Vpn Client Certificate Revocation List Result",
      description:
        "Result from ImportClientVpnClientCertificateRevocationList operation",
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

export default importClientVpnClientCertificateRevocationList;
