import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeEgressOnlyInternetGatewaysCommand,
} from "@aws-sdk/client-ec2";

const describeEgressOnlyInternetGateways: AppBlock = {
  name: "Describe Egress Only Internet Gateways",
  description: "Describes your egress-only internet gateways.",
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
        EgressOnlyInternetGatewayIds: {
          name: "Egress Only Internet Gateway Ids",
          description: "The IDs of the egress-only internet gateways.",
          type: {
            type: "array",
            items: {
              type: "string",
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
          description: "The token returned from a previous paginated request.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeEgressOnlyInternetGatewaysCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Egress Only Internet Gateways Result",
      description: "Result from DescribeEgressOnlyInternetGateways operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EgressOnlyInternetGateways: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Attachments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VpcId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                EgressOnlyInternetGatewayId: {
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
            description: "Information about the egress-only internet gateways.",
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

export default describeEgressOnlyInternetGateways;
