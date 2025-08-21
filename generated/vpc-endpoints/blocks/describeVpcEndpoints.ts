import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpcEndpointsCommand } from "@aws-sdk/client-ec2";

const describeVpcEndpoints: AppBlock = {
  name: "Describe Vpc Endpoints",
  description: "Describes your VPC endpoints.",
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
        VpcEndpointIds: {
          name: "Vpc Endpoint Ids",
          description: "The IDs of the VPC endpoints.",
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
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

        const command = new DescribeVpcEndpointsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Endpoints Result",
      description: "Result from DescribeVpcEndpoints operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcEndpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                VpcEndpointId: {
                  type: "string",
                },
                VpcEndpointType: {
                  type: "string",
                },
                VpcId: {
                  type: "string",
                },
                ServiceName: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                PolicyDocument: {
                  type: "string",
                },
                RouteTableIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                SubnetIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Groups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      GroupId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GroupName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                IpAddressType: {
                  type: "string",
                },
                DnsOptions: {
                  type: "object",
                  properties: {
                    DnsRecordIpType: {
                      type: "string",
                    },
                    PrivateDnsOnlyForInboundResolverEndpoint: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                PrivateDnsEnabled: {
                  type: "boolean",
                },
                RequesterManaged: {
                  type: "boolean",
                },
                NetworkInterfaceIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                DnsEntries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      DnsName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      HostedZoneId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                CreationTimestamp: {
                  type: "string",
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
                OwnerId: {
                  type: "string",
                },
                LastError: {
                  type: "object",
                  properties: {
                    Message: {
                      type: "string",
                    },
                    Code: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Ipv4Prefixes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IpPrefixes: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Ipv6Prefixes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IpPrefixes: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                FailureReason: {
                  type: "string",
                },
                ServiceNetworkArn: {
                  type: "string",
                },
                ResourceConfigurationArn: {
                  type: "string",
                },
                ServiceRegion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the VPC endpoints.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcEndpoints;
