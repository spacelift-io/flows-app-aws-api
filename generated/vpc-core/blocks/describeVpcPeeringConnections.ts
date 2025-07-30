import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcPeeringConnectionsCommand,
} from "@aws-sdk/client-ec2";

const describeVpcPeeringConnections: AppBlock = {
  name: "Describe Vpc Peering Connections",
  description: "Describes your VPC peering connections.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
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
        VpcPeeringConnectionIds: {
          name: "Vpc Peering Connection Ids",
          description: "The IDs of the VPC peering connections.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
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

        const command = new DescribeVpcPeeringConnectionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Peering Connections Result",
      description: "Result from DescribeVpcPeeringConnections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcPeeringConnections: {
            type: "array",
            items: {
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
                        additionalProperties: true,
                      },
                    },
                    CidrBlockSet: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    OwnerId: {
                      type: "string",
                    },
                    PeeringOptions: {
                      type: "object",
                      properties: {
                        AllowDnsResolutionFromRemoteVpc: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowEgressFromLocalClassicLinkToRemoteVpc: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowEgressFromLocalVpcToRemoteClassicLink: {
                          type: "object",
                          additionalProperties: true,
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
                        additionalProperties: true,
                      },
                    },
                    CidrBlockSet: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    OwnerId: {
                      type: "string",
                    },
                    PeeringOptions: {
                      type: "object",
                      properties: {
                        AllowDnsResolutionFromRemoteVpc: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowEgressFromLocalClassicLinkToRemoteVpc: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowEgressFromLocalVpcToRemoteClassicLink: {
                          type: "object",
                          additionalProperties: true,
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
                VpcPeeringConnectionId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the VPC peering connections.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcPeeringConnections;
