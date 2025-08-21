import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpnGatewaysCommand } from "@aws-sdk/client-ec2";

const describeVpnGateways: AppBlock = {
  name: "Describe Vpn Gateways",
  description: "Describes one or more of your virtual private gateways.",
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
        VpnGatewayIds: {
          name: "Vpn Gateway Ids",
          description: "One or more virtual private gateway IDs.",
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

        const command = new DescribeVpnGatewaysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpn Gateways Result",
      description: "Result from DescribeVpnGateways operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnGateways: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AmazonSideAsn: {
                  type: "number",
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
                VpnGatewayId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                VpcAttachments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      VpcId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
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
            description:
              "Information about one or more virtual private gateways.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpnGateways;
