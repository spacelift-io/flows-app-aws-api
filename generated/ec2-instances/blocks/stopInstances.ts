import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, StopInstancesCommand } from "@aws-sdk/client-ec2";

const stopInstances: AppBlock = {
  name: "Stop Instances",
  description: "Stops an Amazon EBS-backed instance.",
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
        Hibernate: {
          name: "Hibernate",
          description:
            "Hibernates the instance if the instance was enabled for hibernation at launch.",
          type: "boolean",
          required: false,
        },
        SkipOsShutdown: {
          name: "Skip Os Shutdown",
          description:
            "Specifies whether to bypass the graceful OS shutdown process when the instance is stopped.",
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
        Force: {
          name: "Force",
          description: "Forces the instance to stop.",
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

        const command = new StopInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Instances Result",
      description: "Result from StopInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StoppingInstances: {
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
            description: "Information about the stopped instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopInstances;
