import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeGlobalTableSettingsCommand,
} from "@aws-sdk/client-dynamodb";

const describeGlobalTableSettings: AppBlock = {
  name: "Describe Global Table Settings",
  description: "Describes Region-specific settings for a global table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GlobalTableName: {
          name: "Global Table Name",
          description: "The name of the global table to describe.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeGlobalTableSettingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Global Table Settings Result",
      description: "Result from DescribeGlobalTableSettings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GlobalTableName: {
            type: "string",
            description: "The name of the global table.",
          },
          ReplicaSettings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RegionName: {
                  type: "string",
                },
                ReplicaStatus: {
                  type: "string",
                },
                ReplicaBillingModeSummary: {
                  type: "object",
                  properties: {
                    BillingMode: {
                      type: "string",
                    },
                    LastUpdateToPayPerRequestDateTime: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ReplicaProvisionedReadCapacityUnits: {
                  type: "number",
                },
                ReplicaProvisionedReadCapacityAutoScalingSettings: {
                  type: "object",
                  properties: {
                    MinimumUnits: {
                      type: "number",
                    },
                    MaximumUnits: {
                      type: "number",
                    },
                    AutoScalingDisabled: {
                      type: "boolean",
                    },
                    AutoScalingRoleArn: {
                      type: "string",
                    },
                    ScalingPolicies: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ReplicaProvisionedWriteCapacityUnits: {
                  type: "number",
                },
                ReplicaProvisionedWriteCapacityAutoScalingSettings: {
                  type: "object",
                  properties: {
                    MinimumUnits: {
                      type: "number",
                    },
                    MaximumUnits: {
                      type: "number",
                    },
                    AutoScalingDisabled: {
                      type: "boolean",
                    },
                    AutoScalingRoleArn: {
                      type: "string",
                    },
                    ScalingPolicies: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ReplicaGlobalSecondaryIndexSettings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      IndexName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IndexStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProvisionedReadCapacityUnits: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProvisionedReadCapacityAutoScalingSettings: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProvisionedWriteCapacityUnits: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProvisionedWriteCapacityAutoScalingSettings: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["IndexName"],
                    additionalProperties: false,
                  },
                },
                ReplicaTableClassSummary: {
                  type: "object",
                  properties: {
                    TableClass: {
                      type: "string",
                    },
                    LastUpdateDateTime: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["RegionName"],
              additionalProperties: false,
            },
            description: "The Region-specific settings for the global table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeGlobalTableSettings;
