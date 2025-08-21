import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifySpotFleetRequestCommand } from "@aws-sdk/client-ec2";

const modifySpotFleetRequest: AppBlock = {
  name: "Modify Spot Fleet Request",
  description: "Modifies the specified Spot Fleet request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LaunchTemplateConfigs: {
          name: "Launch Template Configs",
          description: "The launch template and overrides.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LaunchTemplateSpecification: {
                  type: "object",
                  properties: {
                    LaunchTemplateId: {
                      type: "string",
                    },
                    LaunchTemplateName: {
                      type: "string",
                    },
                    Version: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Overrides: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      InstanceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SpotPrice: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AvailabilityZone: {
                        type: "object",
                        additionalProperties: true,
                      },
                      WeightedCapacity: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Priority: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceRequirements: {
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
          },
          required: false,
        },
        OnDemandTargetCapacity: {
          name: "On Demand Target Capacity",
          description: "The number of On-Demand Instances in the fleet.",
          type: "number",
          required: false,
        },
        Context: {
          name: "Context",
          description: "Reserved.",
          type: "string",
          required: false,
        },
        SpotFleetRequestId: {
          name: "Spot Fleet Request Id",
          description: "The ID of the Spot Fleet request.",
          type: "string",
          required: true,
        },
        TargetCapacity: {
          name: "Target Capacity",
          description: "The size of the fleet.",
          type: "number",
          required: false,
        },
        ExcessCapacityTerminationPolicy: {
          name: "Excess Capacity Termination Policy",
          description:
            "Indicates whether running instances should be terminated if the target capacity of the Spot Fleet request is decreased below the current size of the Spot Fleet.",
          type: "string",
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

        const command = new ModifySpotFleetRequestCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Spot Fleet Request Result",
      description: "Result from ModifySpotFleetRequest operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description: "If the request succeeds, the response returns true.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifySpotFleetRequest;
