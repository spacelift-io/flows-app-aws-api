import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeClientVpnConnectionsCommand,
} from "@aws-sdk/client-ec2";

const describeClientVpnConnections: AppBlock = {
  name: "Describe Client Vpn Connections",
  description:
    "Describes active client connections and connections that have been terminated within the last 60 minutes for the specified Client VPN endpoint.",
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
        Filters: {
          name: "Filters",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
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

        const command = new DescribeClientVpnConnectionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Client Vpn Connections Result",
      description: "Result from DescribeClientVpnConnections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Connections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClientVpnEndpointId: {
                  type: "string",
                },
                Timestamp: {
                  type: "string",
                },
                ConnectionId: {
                  type: "string",
                },
                Username: {
                  type: "string",
                },
                ConnectionEstablishedTime: {
                  type: "string",
                },
                IngressBytes: {
                  type: "string",
                },
                EgressBytes: {
                  type: "string",
                },
                IngressPackets: {
                  type: "string",
                },
                EgressPackets: {
                  type: "string",
                },
                ClientIp: {
                  type: "string",
                },
                CommonName: {
                  type: "string",
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
                },
                ConnectionEndTime: {
                  type: "string",
                },
                PostureComplianceStatuses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the active and terminated client connections.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClientVpnConnections;
