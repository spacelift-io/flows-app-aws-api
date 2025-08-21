import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AcceptVpcPeeringConnectionCommand,
} from "@aws-sdk/client-ec2";

const acceptVpcPeeringConnection: AppBlock = {
  name: "Accept Vpc Peering Connection",
  description: "Accept a VPC peering connection request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        VpcPeeringConnectionId: {
          name: "Vpc Peering Connection Id",
          description: "The ID of the VPC peering connection.",
          type: "string",
          required: true,
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

        const command = new AcceptVpcPeeringConnectionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Accept Vpc Peering Connection Result",
      description: "Result from AcceptVpcPeeringConnection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcPeeringConnection: {
            type: "object",
            properties: {
              AccepterVpcInfo: {
                type: "object",
                properties: {
                  CidrBlock: {
                    type: "string",
                  },
                  Ipv6CidrBlockSet: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Ipv6CidrBlock: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  CidrBlockSet: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        CidrBlock: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  OwnerId: {
                    type: "string",
                  },
                  PeeringOptions: {
                    type: "object",
                    properties: {
                      AllowDnsResolutionFromRemoteVpc: {
                        type: "boolean",
                      },
                      AllowEgressFromLocalClassicLinkToRemoteVpc: {
                        type: "boolean",
                      },
                      AllowEgressFromLocalVpcToRemoteClassicLink: {
                        type: "boolean",
                      },
                    },
                    additionalProperties: false,
                  },
                  VpcId: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              ExpirationTime: {
                type: "string",
              },
              RequesterVpcInfo: {
                type: "object",
                properties: {
                  CidrBlock: {
                    type: "string",
                  },
                  Ipv6CidrBlockSet: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Ipv6CidrBlock: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  CidrBlockSet: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        CidrBlock: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  OwnerId: {
                    type: "string",
                  },
                  PeeringOptions: {
                    type: "object",
                    properties: {
                      AllowDnsResolutionFromRemoteVpc: {
                        type: "boolean",
                      },
                      AllowEgressFromLocalClassicLinkToRemoteVpc: {
                        type: "boolean",
                      },
                      AllowEgressFromLocalVpcToRemoteClassicLink: {
                        type: "boolean",
                      },
                    },
                    additionalProperties: false,
                  },
                  VpcId: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
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
              VpcPeeringConnectionId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the VPC peering connection.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default acceptVpcPeeringConnection;
