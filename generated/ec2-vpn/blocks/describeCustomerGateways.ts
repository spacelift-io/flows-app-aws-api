import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeCustomerGatewaysCommand,
} from "@aws-sdk/client-ec2";

const describeCustomerGateways: AppBlock = {
  name: "Describe Customer Gateways",
  description: "Describes one or more of your VPN customer gateways.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CustomerGatewayIds: {
          name: "Customer Gateway Ids",
          description: "One or more customer gateway IDs.",
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

        const command = new DescribeCustomerGatewaysCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Customer Gateways Result",
      description: "Result from DescribeCustomerGateways operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CustomerGateways: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CertificateArn: {
                  type: "string",
                },
                DeviceName: {
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
                BgpAsnExtended: {
                  type: "string",
                },
                CustomerGatewayId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                IpAddress: {
                  type: "string",
                },
                BgpAsn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about one or more customer gateways.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCustomerGateways;
