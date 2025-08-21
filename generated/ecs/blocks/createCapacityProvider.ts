import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, CreateCapacityProviderCommand } from "@aws-sdk/client-ecs";

const createCapacityProvider: AppBlock = {
  name: "Create Capacity Provider",
  description: "Creates a new capacity provider.",
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
          description: "The name of the capacity provider.",
          type: "string",
          required: true,
        },
        autoScalingGroupProvider: {
          name: "auto Scaling Group Provider",
          description:
            "The details of the Auto Scaling group for the capacity provider.",
          type: {
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
          required: true,
        },
        tags: {
          name: "tags",
          description:
            "The metadata that you apply to the capacity provider to categorize and organize them more conveniently.",
          type: {
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
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateCapacityProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Capacity Provider Result",
      description: "Result from CreateCapacityProvider operation",
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
            description: "The full description of the new capacity provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCapacityProvider;
