import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeNatGatewaysCommand } from "@aws-sdk/client-ec2";

const describeNatGateways: AppBlock = {
  name: "Describe Nat Gateways",
  description: "Describes your NAT gateways.",
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
        Filter: {
          name: "Filter",
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
        NatGatewayIds: {
          name: "Nat Gateway Ids",
          description: "The IDs of the NAT gateways.",
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

        const command = new DescribeNatGatewaysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Nat Gateways Result",
      description: "Result from DescribeNatGateways operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NatGateways: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkInterfaceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PrivateIp: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PublicIp: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AssociationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IsPrimary: {
                        type: "object",
                        additionalProperties: true,
                      },
                      FailureMessage: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
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
                ConnectivityType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the NAT gateways.",
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

export default describeNatGateways;
