import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  TerminateClientVpnConnectionsCommand,
} from "@aws-sdk/client-ec2";

const terminateClientVpnConnections: AppBlock = {
  name: "Terminate Client Vpn Connections",
  description: "Terminates active Client VPN endpoint connections.",
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
            "The ID of the Client VPN endpoint to which the client is connected.",
          type: "string",
          required: true,
        },
        ConnectionId: {
          name: "Connection Id",
          description: "The ID of the client connection to be terminated.",
          type: "string",
          required: false,
        },
        Username: {
          name: "Username",
          description: "The name of the user who initiated the connection.",
          type: "string",
          required: false,
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

        const command = new TerminateClientVpnConnectionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Terminate Client Vpn Connections Result",
      description: "Result from TerminateClientVpnConnections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientVpnEndpointId: {
            type: "string",
            description: "The ID of the Client VPN endpoint.",
          },
          Username: {
            type: "string",
            description:
              "The user who established the terminated client connections.",
          },
          ConnectionStatuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ConnectionId: {
                  type: "string",
                },
                PreviousStatus: {
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
                },
                CurrentStatus: {
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
                },
              },
              additionalProperties: false,
            },
            description: "The current state of the client connections.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default terminateClientVpnConnections;
