import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyVpnConnectionCommand } from "@aws-sdk/client-ec2";

const modifyVpnConnection: AppBlock = {
  name: "Modify Vpn Connection",
  description:
    "Modifies the customer gateway or the target gateway of an Amazon Web Services Site-to-Site VPN connection.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpnConnectionId: {
          name: "Vpn Connection Id",
          description: "The ID of the VPN connection.",
          type: "string",
          required: true,
        },
        TransitGatewayId: {
          name: "Transit Gateway Id",
          description: "The ID of the transit gateway.",
          type: "string",
          required: false,
        },
        CustomerGatewayId: {
          name: "Customer Gateway Id",
          description:
            "The ID of the customer gateway at your end of the VPN connection.",
          type: "string",
          required: false,
        },
        VpnGatewayId: {
          name: "Vpn Gateway Id",
          description:
            "The ID of the virtual private gateway at the Amazon Web Services side of the VPN connection.",
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

        const command = new ModifyVpnConnectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpn Connection Result",
      description: "Result from ModifyVpnConnection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnConnection: {
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
                      properties: {
                        OutsideIpAddress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TunnelInsideCidr: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TunnelInsideIpv6Cidr: {
                          type: "object",
                          additionalProperties: true,
                        },
                        PreSharedKey: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase1LifetimeSeconds: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase2LifetimeSeconds: {
                          type: "object",
                          additionalProperties: true,
                        },
                        RekeyMarginTimeSeconds: {
                          type: "object",
                          additionalProperties: true,
                        },
                        RekeyFuzzPercentage: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ReplayWindowSize: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DpdTimeoutSeconds: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DpdTimeoutAction: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase1EncryptionAlgorithms: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase2EncryptionAlgorithms: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase1IntegrityAlgorithms: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase2IntegrityAlgorithms: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase1DHGroupNumbers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Phase2DHGroupNumbers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        IkeVersions: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StartupAction: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LogOptions: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EnableTunnelLifecycleControl: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
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
                      type: "string",
                    },
                    Source: {
                      type: "string",
                    },
                    State: {
                      type: "string",
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
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
                      type: "number",
                    },
                    LastStatusChange: {
                      type: "string",
                    },
                    OutsideIpAddress: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    StatusMessage: {
                      type: "string",
                    },
                    CertificateArn: {
                      type: "string",
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
            description: "Information about the VPN connection.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpnConnection;
