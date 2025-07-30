import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, UpdateCapacityProviderCommand } from "@aws-sdk/client-ecs";

const updateCapacityProvider: AppBlock = {
  name: "Update Capacity Provider",
  description: "Modifies the parameters for a capacity provider.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description: "The name of the capacity provider to update.",
          type: "string",
          required: true,
        },
        autoScalingGroupProvider: {
          name: "auto Scaling Group Provider",
          description:
            "An object that represent the parameters to update for the Auto Scaling group capacity provider.",
          type: {
            type: "object",
            properties: {
              managedScaling: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                  },
                  targetCapacity: {
                    type: "number",
                  },
                  minimumScalingStepSize: {
                    type: "number",
                  },
                  maximumScalingStepSize: {
                    type: "number",
                  },
                  instanceWarmupPeriod: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              managedTerminationProtection: {
                type: "string",
              },
              managedDraining: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateCapacityProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Capacity Provider Result",
      description: "Result from UpdateCapacityProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          capacityProvider: {
            type: "object",
            properties: {
              capacityProviderArn: {
                type: "string",
              },
              name: {
                type: "string",
              },
              status: {
                type: "string",
              },
              autoScalingGroupProvider: {
                type: "object",
                properties: {
                  autoScalingGroupArn: {
                    type: "string",
                  },
                  managedScaling: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                      },
                      targetCapacity: {
                        type: "number",
                      },
                      minimumScalingStepSize: {
                        type: "number",
                      },
                      maximumScalingStepSize: {
                        type: "number",
                      },
                      instanceWarmupPeriod: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  managedTerminationProtection: {
                    type: "string",
                  },
                  managedDraining: {
                    type: "string",
                  },
                },
                required: ["autoScalingGroupArn"],
                additionalProperties: false,
              },
              updateStatus: {
                type: "string",
              },
              updateStatusReason: {
                type: "string",
              },
              tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Details about the capacity provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateCapacityProvider;
