import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeAddressesCommand } from "@aws-sdk/client-ec2";

const describeAddresses: AppBlock = {
  name: "Describe Addresses",
  description:
    "Describes the specified Elastic IP addresses or all of your Elastic IP addresses.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PublicIps: {
          name: "Public Ips",
          description: "One or more Elastic IP addresses.",
          type: {
            type: "array",
            items: {
              type: "string",
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
        AllocationIds: {
          name: "Allocation Ids",
          description: "Information about the allocation IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
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

        const command = new DescribeAddressesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Addresses Result",
      description: "Result from DescribeAddresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Addresses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AllocationId: {
                  type: "string",
                },
                AssociationId: {
                  type: "string",
                },
                Domain: {
                  type: "string",
                },
                NetworkInterfaceId: {
                  type: "string",
                },
                NetworkInterfaceOwnerId: {
                  type: "string",
                },
                PrivateIpAddress: {
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
                PublicIpv4Pool: {
                  type: "string",
                },
                NetworkBorderGroup: {
                  type: "string",
                },
                CustomerOwnedIp: {
                  type: "string",
                },
                CustomerOwnedIpv4Pool: {
                  type: "string",
                },
                CarrierIp: {
                  type: "string",
                },
                SubnetId: {
                  type: "string",
                },
                ServiceManaged: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                PublicIp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Elastic IP addresses.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAddresses;
