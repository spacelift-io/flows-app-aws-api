import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpnConnectionsCommand } from "@aws-sdk/client-ec2";

const describeVpnConnections: AppBlock = {
  name: "Describe Vpn Connections",
  description: "Describes one or more of your VPN connections.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        VpnConnectionIds: {
          name: "Vpn Connection Ids",
          description: "One or more VPN connection IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
        });

        const command = new DescribeVpnConnectionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpn Connections Result",
      description: "Result from DescribeVpnConnections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnConnections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Category: {
                  type: "string",
                },
                TransitGatewayId: {
                  type: "string",
                },
                CoreNetworkArn: {
                  type: "string",
                },
                CoreNetworkAttachmentArn: {
                  type: "string",
                },
                GatewayAssociationState: {
                  type: "string",
                },
                Options: {
                  type: "object",
                  properties: {
                    EnableAcceleration: {
                      type: "boolean",
                    },
                    StaticRoutesOnly: {
                      type: "boolean",
                    },
                    LocalIpv4NetworkCidr: {
                      type: "string",
                    },
                    RemoteIpv4NetworkCidr: {
                      type: "string",
                    },
                    LocalIpv6NetworkCidr: {
                      type: "string",
                    },
                    RemoteIpv6NetworkCidr: {
                      type: "string",
                    },
                    OutsideIpAddressType: {
                      type: "string",
                    },
                    TransportTransitGatewayAttachmentId: {
                      type: "string",
                    },
                    TunnelInsideIpVersion: {
                      type: "string",
                    },
                    TunnelOptions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                Routes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      DestinationCidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Source: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                VgwTelemetry: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AcceptedRouteCount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LastStatusChange: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OutsideIpAddress: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StatusMessage: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CertificateArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                PreSharedKeyArn: {
                  type: "string",
                },
                VpnConnectionId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                CustomerGatewayConfiguration: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                CustomerGatewayId: {
                  type: "string",
                },
                VpnGatewayId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about one or more VPN connections.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpnConnections;
