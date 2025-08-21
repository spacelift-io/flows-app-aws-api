import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTransitGatewayPolicyTablesCommand,
} from "@aws-sdk/client-ec2";

const describeTransitGatewayPolicyTables: AppBlock = {
  name: "Describe Transit Gateway Policy Tables",
  description: "Describes one or more transit gateway route policy tables.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayPolicyTableIds: {
          name: "Transit Gateway Policy Table Ids",
          description: "The IDs of the transit gateway policy tables.",
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
          description:
            "The filters associated with the transit gateway policy table.",
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
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
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

        const command = new DescribeTransitGatewayPolicyTablesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateway Policy Tables Result",
      description: "Result from DescribeTransitGatewayPolicyTables operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPolicyTables: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TransitGatewayPolicyTableId: {
                  type: "string",
                },
                TransitGatewayId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                CreationTime: {
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
            description: "Describes the transit gateway policy tables.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTransitGatewayPolicyTables;
