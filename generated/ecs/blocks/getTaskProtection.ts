import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, GetTaskProtectionCommand } from "@aws-sdk/client-ecs";

const getTaskProtection: AppBlock = {
  name: "Get Task Protection",
  description:
    "Retrieves the protection status of tasks in an Amazon ECS service.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        cluster: {
          name: "cluster",
          description:
            "The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service that the task sets exist in.",
          type: "string",
          required: true,
        },
        tasks: {
          name: "tasks",
          description: "A list of up to 100 task IDs or full ARN entries.",
          type: {
            type: "array",
            items: {
              type: "string",
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

        const command = new GetTaskProtectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Task Protection Result",
      description: "Result from GetTaskProtection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          protectedTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                taskArn: {
                  type: "string",
                },
                protectionEnabled: {
                  type: "boolean",
                },
                expirationDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of tasks with the following information.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                arn: {
                  type: "string",
                },
                reason: {
                  type: "string",
                },
                detail: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any failures associated with the call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTaskProtection;
