import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpcsCommand } from "@aws-sdk/client-ec2";

const describeVpcs: AppBlock = {
  name: "Describe Vpcs",
  description: "Describes your VPCs.",
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
        VpcIds: {
          name: "Vpc Ids",
          description: "The IDs of the VPCs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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

        const command = new DescribeVpcsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpcs Result",
      description: "Result from DescribeVpcs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          Vpcs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OwnerId: {
                  type: "string",
                },
                InstanceTenancy: {
                  type: "string",
                },
                Ipv6CidrBlockAssociationSet: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AssociationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6CidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6CidrBlockState: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkBorderGroup: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6Pool: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6AddressAttribute: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IpSource: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                CidrBlockAssociationSet: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AssociationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CidrBlockState: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                IsDefault: {
                  type: "boolean",
                },
                EncryptionControl: {
                  type: "object",
                  properties: {
                    VpcId: {
                      type: "string",
                    },
                    VpcEncryptionControlId: {
                      type: "string",
                    },
                    Mode: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                    StateMessage: {
                      type: "string",
                    },
                    ResourceExclusions: {
                      type: "object",
                      properties: {
                        InternetGateway: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EgressOnlyInternetGateway: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NatGateway: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VirtualPrivateGateway: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VpcPeering: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
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
                BlockPublicAccessStates: {
                  type: "object",
                  properties: {
                    InternetGatewayBlockMode: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                VpcId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                CidrBlock: {
                  type: "string",
                },
                DhcpOptionsId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the VPCs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcs;
