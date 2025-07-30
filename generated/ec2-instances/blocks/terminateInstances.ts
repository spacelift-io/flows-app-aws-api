import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

const terminateInstances: AppBlock = {
  name: "Terminate Instances",
  description: "Shuts down the specified instances.",
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
        Force: {
          name: "Force",
          description: "Forces the instances to terminate.",
          type: "boolean",
          required: false,
        },
        SkipOsShutdown: {
          name: "Skip Os Shutdown",
          description:
            "Specifies whether to bypass the graceful OS shutdown process when the instance is terminated.",
          type: "boolean",
          required: false,
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

        const command = new TerminateInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Terminate Instances Result",
      description: "Result from TerminateInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TerminatingInstances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                CurrentState: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "number",
                    },
                    Name: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                PreviousState: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "number",
                    },
                    Name: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the terminated instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default terminateInstances;
