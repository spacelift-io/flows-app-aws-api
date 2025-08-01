import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  SubmitContainerStateChangeCommand,
} from "@aws-sdk/client-ecs";

const submitContainerStateChange: AppBlock = {
  name: "Submit Container State Change",
  description:
    "This action is only used by the Amazon ECS agent, and it is not intended for use outside of the agent.",
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
            "The short name or full ARN of the cluster that hosts the container.",
          type: "string",
          required: false,
        },
        task: {
          name: "task",
          description:
            "The task ID or full Amazon Resource Name (ARN) of the task that hosts the container.",
          type: "string",
          required: false,
        },
        containerName: {
          name: "container Name",
          description: "The name of the container.",
          type: "string",
          required: false,
        },
        runtimeId: {
          name: "runtime Id",
          description: "The ID of the Docker container.",
          type: "string",
          required: false,
        },
        status: {
          name: "status",
          description: "The status of the state change request.",
          type: "string",
          required: false,
        },
        exitCode: {
          name: "exit Code",
          description:
            "The exit code that's returned for the state change request.",
          type: "number",
          required: false,
        },
        reason: {
          name: "reason",
          description: "The reason for the state change request.",
          type: "string",
          required: false,
        },
        networkBindings: {
          name: "network Bindings",
          description: "The network bindings of the container.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bindIP: {
                  type: "string",
                },
                containerPort: {
                  type: "number",
                },
                hostPort: {
                  type: "number",
                },
                protocol: {
                  type: "string",
                },
                containerPortRange: {
                  type: "string",
                },
                hostPortRange: {
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
        });

        const command = new SubmitContainerStateChangeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Submit Container State Change Result",
      description: "Result from SubmitContainerStateChange operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          acknowledgment: {
            type: "string",
            description: "Acknowledgement of the state change.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default submitContainerStateChange;
