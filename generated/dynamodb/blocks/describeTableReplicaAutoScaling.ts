import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeTableReplicaAutoScalingCommand,
} from "@aws-sdk/client-dynamodb";

const describeTableReplicaAutoScaling: AppBlock = {
  name: "Describe Table Replica Auto Scaling",
  description:
    "Describes auto scaling settings across replicas of the global table at once.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the table.",
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

        const command = new DescribeTableReplicaAutoScalingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Table Replica Auto Scaling Result",
      description: "Result from DescribeTableReplicaAutoScaling operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableAutoScalingDescription: {
            type: "object",
            properties: {
              TableName: {
                type: "string",
              },
              TableStatus: {
                type: "string",
              },
              Replicas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RegionName: {
                      type: "string",
                    },
                    GlobalSecondaryIndexes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    ReplicaProvisionedReadCapacityAutoScalingSettings: {
                      type: "object",
                      properties: {
                        MinimumUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MaximumUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AutoScalingDisabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AutoScalingRoleArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ScalingPolicies: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ReplicaProvisionedWriteCapacityAutoScalingSettings: {
                      type: "object",
                      properties: {
                        MinimumUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MaximumUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AutoScalingDisabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AutoScalingRoleArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ScalingPolicies: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ReplicaStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Represents the auto scaling properties of the table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTableReplicaAutoScaling;
