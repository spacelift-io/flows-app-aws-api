import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, CreateAccessEntryCommand } from "@aws-sdk/client-eks";

const createAccessEntry: AppBlock = {
  name: "Create Access Entry",
  description: "Creates an access entry.",
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
        tags: {
          name: "tags",
          description:
            "Metadata that assists with categorization and organization.",
          type: {
            type: "object",
            additionalProperties: {
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
        type: {
          name: "type",
          description: "The type of the new access entry.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateAccessEntryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Access Entry Result",
      description: "Result from CreateAccessEntry operation",
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
            description:
              "An access entry allows an IAM principal (user or role) to access your cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createAccessEntry;
