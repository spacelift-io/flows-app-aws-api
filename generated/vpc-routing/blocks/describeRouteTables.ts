import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeRouteTablesCommand } from "@aws-sdk/client-ec2";

const describeRouteTables: AppBlock = {
  name: "Describe Route Tables",
  description: "Describes your route tables.",
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
        RouteTableIds: {
          name: "Route Table Ids",
          description: "The IDs of the route tables.",
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

        const command = new DescribeRouteTablesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Route Tables Result",
      description: "Result from DescribeRouteTables operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RouteTables: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Associations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Main: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RouteTableAssociationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RouteTableId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AssociationState: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                PropagatingVgws: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      GatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                RouteTableId: {
                  type: "string",
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
                      DestinationIpv6CidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DestinationPrefixListId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EgressOnlyInternetGatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceOwnerId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NatGatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TransitGatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LocalGatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CarrierGatewayId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkInterfaceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Origin: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VpcPeeringConnectionId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CoreNetworkArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OdbNetworkArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IpAddress: {
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
                VpcId: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the route tables.",
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

export default describeRouteTables;
