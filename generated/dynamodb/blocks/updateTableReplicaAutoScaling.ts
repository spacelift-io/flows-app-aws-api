import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  UpdateTableReplicaAutoScalingCommand,
} from "@aws-sdk/client-dynamodb";

const updateTableReplicaAutoScaling: AppBlock = {
  name: "Update Table Replica Auto Scaling",
  description: "Updates auto scaling settings on your global tables at once.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GlobalSecondaryIndexUpdates: {
          name: "Global Secondary Index Updates",
          description:
            "Represents the auto scaling settings of the global secondary indexes of the replica to be updated.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IndexName: {
                  type: "string",
                },
                ProvisionedWriteCapacityAutoScalingUpdate: {
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
                    ScalingPolicyUpdate: {
                      type: "object",
                      properties: {
                        PolicyName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TargetTrackingScalingPolicyConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["TargetTrackingScalingPolicyConfiguration"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the global table to be updated.",
          type: "string",
          required: true,
        },
        ProvisionedWriteCapacityAutoScalingUpdate: {
          name: "Provisioned Write Capacity Auto Scaling Update",
          description:
            "Represents the auto scaling settings to be modified for a global table or global secondary index.",
          type: {
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
              ScalingPolicyUpdate: {
                type: "object",
                properties: {
                  PolicyName: {
                    type: "string",
                  },
                  TargetTrackingScalingPolicyConfiguration: {
                    type: "object",
                    properties: {
                      DisableScaleIn: {
                        type: "boolean",
                      },
                      ScaleInCooldown: {
                        type: "number",
                      },
                      ScaleOutCooldown: {
                        type: "number",
                      },
                      TargetValue: {
                        type: "number",
                      },
                    },
                    required: ["TargetValue"],
                    additionalProperties: false,
                  },
                },
                required: ["TargetTrackingScalingPolicyConfiguration"],
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ReplicaUpdates: {
          name: "Replica Updates",
          description:
            "Represents the auto scaling settings of replicas of the table that will be modified.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RegionName: {
                  type: "string",
                },
                ReplicaGlobalSecondaryIndexUpdates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      IndexName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProvisionedReadCapacityAutoScalingUpdate: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReplicaProvisionedReadCapacityAutoScalingUpdate: {
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
                    ScalingPolicyUpdate: {
                      type: "object",
                      properties: {
                        PolicyName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TargetTrackingScalingPolicyConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["TargetTrackingScalingPolicyConfiguration"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["RegionName"],
              additionalProperties: false,
            },
          },
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateTableReplicaAutoScalingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Table Replica Auto Scaling Result",
      description: "Result from UpdateTableReplicaAutoScaling operation",
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
            description:
              "Returns information about the auto scaling settings of a table with replicas.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateTableReplicaAutoScaling;
