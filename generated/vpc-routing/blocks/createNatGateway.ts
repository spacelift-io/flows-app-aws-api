import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateNatGatewayCommand } from "@aws-sdk/client-ec2";

const createNatGateway: AppBlock = {
  name: "Create Nat Gateway",
  description: "Creates a NAT gateway in the specified subnet.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationId: {
          name: "Allocation Id",
          description:
            "[Public NAT gateways only] The allocation ID of an Elastic IP address to associate with the NAT gateway.",
          type: "string",
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
        SubnetId: {
          name: "Subnet Id",
          description:
            "The ID of the subnet in which to create the NAT gateway.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to assign to the NAT gateway.",
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
        ConnectivityType: {
          name: "Connectivity Type",
          description:
            "Indicates whether the NAT gateway supports public or private connectivity.",
          type: "string",
          required: false,
        },
        PrivateIpAddress: {
          name: "Private Ip Address",
          description: "The private IPv4 address to assign to the NAT gateway.",
          type: "string",
          required: false,
        },
        SecondaryAllocationIds: {
          name: "Secondary Allocation Ids",
          description: "Secondary EIP allocation IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SecondaryPrivateIpAddresses: {
          name: "Secondary Private Ip Addresses",
          description: "Secondary private IPv4 addresses.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SecondaryPrivateIpAddressCount: {
          name: "Secondary Private Ip Address Count",
          description:
            "[Private NAT gateway only] The number of secondary private IPv4 addresses you want to assign to the NAT gateway.",
          type: "number",
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

        const command = new CreateNatGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Nat Gateway Result",
      description: "Result from CreateNatGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier to ensure the idempotency of the request.",
          },
          NatGateway: {
            type: "object",
            properties: {
              CreateTime: {
                type: "string",
              },
              DeleteTime: {
                type: "string",
              },
              FailureCode: {
                type: "string",
              },
              FailureMessage: {
                type: "string",
              },
              NatGatewayAddresses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AllocationId: {
                      type: "string",
                    },
                    NetworkInterfaceId: {
                      type: "string",
                    },
                    PrivateIp: {
                      type: "string",
                    },
                    PublicIp: {
                      type: "string",
                    },
                    AssociationId: {
                      type: "string",
                    },
                    IsPrimary: {
                      type: "boolean",
                    },
                    FailureMessage: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              NatGatewayId: {
                type: "string",
              },
              ProvisionedBandwidth: {
                type: "object",
                properties: {
                  ProvisionTime: {
                    type: "string",
                  },
                  Provisioned: {
                    type: "string",
                  },
                  RequestTime: {
                    type: "string",
                  },
                  Requested: {
                    type: "string",
                  },
                  Status: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              State: {
                type: "string",
              },
              SubnetId: {
                type: "string",
              },
              VpcId: {
                type: "string",
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
              ConnectivityType: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the NAT gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createNatGateway;
