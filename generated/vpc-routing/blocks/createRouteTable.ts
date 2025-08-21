import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateRouteTableCommand } from "@aws-sdk/client-ec2";

const createRouteTable: AppBlock = {
  name: "Create Route Table",
  description: "Creates a route table for the specified VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to assign to the route table.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
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
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
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

        const command = new CreateRouteTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Route Table Result",
      description: "Result from CreateRouteTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RouteTable: {
            type: "object",
            properties: {
              Associations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Main: {
                      type: "boolean",
                    },
                    RouteTableAssociationId: {
                      type: "string",
                    },
                    RouteTableId: {
                      type: "string",
                    },
                    SubnetId: {
                      type: "string",
                    },
                    GatewayId: {
                      type: "string",
                    },
                    AssociationState: {
                      type: "object",
                      properties: {
                        State: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StatusMessage: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
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
                      type: "string",
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
                      type: "string",
                    },
                    DestinationIpv6CidrBlock: {
                      type: "string",
                    },
                    DestinationPrefixListId: {
                      type: "string",
                    },
                    EgressOnlyInternetGatewayId: {
                      type: "string",
                    },
                    GatewayId: {
                      type: "string",
                    },
                    InstanceId: {
                      type: "string",
                    },
                    InstanceOwnerId: {
                      type: "string",
                    },
                    NatGatewayId: {
                      type: "string",
                    },
                    TransitGatewayId: {
                      type: "string",
                    },
                    LocalGatewayId: {
                      type: "string",
                    },
                    CarrierGatewayId: {
                      type: "string",
                    },
                    NetworkInterfaceId: {
                      type: "string",
                    },
                    Origin: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                    VpcPeeringConnectionId: {
                      type: "string",
                    },
                    CoreNetworkArn: {
                      type: "string",
                    },
                    OdbNetworkArn: {
                      type: "string",
                    },
                    IpAddress: {
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
              VpcId: {
                type: "string",
              },
              OwnerId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the route table.",
          },
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier to ensure the idempotency of the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRouteTable;
