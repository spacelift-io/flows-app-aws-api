import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ExportClientVpnClientConfigurationCommand,
} from "@aws-sdk/client-ec2";

const exportClientVpnClientConfiguration: AppBlock = {
  name: "Export Client Vpn Client Configuration",
  description:
    "Downloads the contents of the Client VPN endpoint configuration file for the specified Client VPN endpoint.",
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

        const command = new ExportClientVpnClientConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Export Client Vpn Client Configuration Result",
      description: "Result from ExportClientVpnClientConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientConfiguration: {
            type: "string",
            description:
              "The contents of the Client VPN endpoint configuration file.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default exportClientVpnClientConfiguration;
