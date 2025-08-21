import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyReservedInstancesCommand } from "@aws-sdk/client-ec2";

const modifyReservedInstances: AppBlock = {
  name: "Modify Reserved Instances",
  description:
    "Modifies the configuration of your Reserved Instances, such as the Availability Zone, instance count, or instance type.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedInstancesIds: {
          name: "Reserved Instances Ids",
          description: "The IDs of the Reserved Instances to modify.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "A unique, case-sensitive token you provide to ensure idempotency of your modification request.",
          type: "string",
          required: false,
        },
        TargetConfigurations: {
          name: "Target Configurations",
          description:
            "The configuration settings for the Reserved Instances to modify.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AvailabilityZone: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                InstanceType: {
                  type: "string",
                },
                Platform: {
                  type: "string",
                },
                Scope: {
                  type: "string",
                },
                AvailabilityZoneId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new ModifyReservedInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Reserved Instances Result",
      description: "Result from ModifyReservedInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedInstancesModificationId: {
            type: "string",
            description: "The ID for the modification.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyReservedInstances;
