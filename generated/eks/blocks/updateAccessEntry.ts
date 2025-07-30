import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, UpdateAccessEntryCommand } from "@aws-sdk/client-eks";

const updateAccessEntry: AppBlock = {
  name: "Update Access Entry",
  description: "Updates an access entry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        principalArn: {
          name: "principal Arn",
          description: "The ARN of the IAM principal for the AccessEntry.",
          type: "string",
          required: true,
        },
        kubernetesGroups: {
          name: "kubernetes Groups",
          description:
            "The value for name that you've specified for kind: Group as a subject in a Kubernetes RoleBinding or ClusterRoleBinding object.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        username: {
          name: "username",
          description: "The username to authenticate to Kubernetes with.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateAccessEntryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Access Entry Result",
      description: "Result from UpdateAccessEntry operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          accessEntry: {
            type: "object",
            properties: {
              clusterName: {
                type: "string",
              },
              principalArn: {
                type: "string",
              },
              kubernetesGroups: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              accessEntryArn: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              modifiedAt: {
                type: "string",
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              username: {
                type: "string",
              },
              type: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The ARN of the IAM principal for the AccessEntry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateAccessEntry;
