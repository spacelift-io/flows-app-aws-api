import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeInventoryDeletionsCommand,
} from "@aws-sdk/client-ssm";

const describeInventoryDeletions: AppBlock = {
  name: "Describe Inventory Deletions",
  description: "Describes a specific delete inventory operation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DeletionId: {
          name: "Deletion Id",
          description:
            "Specify the delete inventory ID for which you want information.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DescribeInventoryDeletionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Inventory Deletions Result",
      description: "Result from DescribeInventoryDeletions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InventoryDeletions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DeletionId: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
                DeletionStartTime: {
                  type: "string",
                },
                LastStatus: {
                  type: "string",
                },
                LastStatusMessage: {
                  type: "string",
                },
                DeletionSummary: {
                  type: "object",
                  properties: {
                    TotalCount: {
                      type: "number",
                    },
                    RemainingCount: {
                      type: "number",
                    },
                    SummaryItems: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                LastStatusUpdateTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of status items for deleted inventory.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInventoryDeletions;
