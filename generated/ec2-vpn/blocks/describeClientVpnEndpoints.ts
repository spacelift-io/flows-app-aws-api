import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeClientVpnEndpointsCommand,
} from "@aws-sdk/client-ec2";

const describeClientVpnEndpoints: AppBlock = {
  name: "Describe Client Vpn Endpoints",
  description: "Describes one or more Client VPN endpoints in the account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientVpnEndpointIds: {
          name: "Client Vpn Endpoint Ids",
          description: "The ID of the Client VPN endpoint.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to retrieve the next page of results.",
          type: "string",
          required: false,
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

        const command = new DescribeClientVpnEndpointsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Client Vpn Endpoints Result",
      description: "Result from DescribeClientVpnEndpoints operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientVpnEndpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClientVpnEndpointId: {
                  type: "string",
                },
                Description: {
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
                CreationTime: {
                  type: "string",
                },
                DeletionTime: {
                  type: "string",
                },
                DnsName: {
                  type: "string",
                },
                ClientCidrBlock: {
                  type: "string",
                },
                DnsServers: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                SplitTunnel: {
                  type: "boolean",
                },
                VpnProtocol: {
                  type: "string",
                },
                TransportProtocol: {
                  type: "string",
                },
                VpnPort: {
                  type: "number",
                },
                AssociatedTargetNetworks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      NetworkId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ServerCertificateArn: {
                  type: "string",
                },
                AuthenticationOptions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ActiveDirectory: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MutualAuthentication: {
                        type: "object",
                        additionalProperties: true,
                      },
                      FederatedAuthentication: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ConnectionLogOptions: {
                  type: "object",
                  properties: {
                    Enabled: {
                      type: "boolean",
                    },
                    CloudwatchLogGroup: {
                      type: "string",
                    },
                    CloudwatchLogStream: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
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
                SecurityGroupIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                VpcId: {
                  type: "string",
                },
                SelfServicePortalUrl: {
                  type: "string",
                },
                ClientConnectOptions: {
                  type: "object",
                  properties: {
                    Enabled: {
                      type: "boolean",
                    },
                    LambdaFunctionArn: {
                      type: "string",
                    },
                    Status: {
                      type: "object",
                      properties: {
                        Code: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Message: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                SessionTimeoutHours: {
                  type: "number",
                },
                ClientLoginBannerOptions: {
                  type: "object",
                  properties: {
                    Enabled: {
                      type: "boolean",
                    },
                    BannerText: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ClientRouteEnforcementOptions: {
                  type: "object",
                  properties: {
                    Enforced: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                DisconnectOnSessionTimeout: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Client VPN endpoints.",
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

export default describeClientVpnEndpoints;
