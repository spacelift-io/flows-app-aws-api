import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, MonitorInstancesCommand } from "@aws-sdk/client-ec2";

const monitorInstances: AppBlock = {
  name: "Monitor Instances",
  description: "Enables detailed monitoring for a running instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceIds: {
          name: "Instance Ids",
          description: "The IDs of the instances.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
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
        });

        const command = new MonitorInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Monitor Instances Result",
      description: "Result from MonitorInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceMonitorings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                Monitoring: {
                  type: "object",
                  properties: {
                    State: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "The monitoring information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default monitorInstances;
