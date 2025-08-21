import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeAccessEntryCommand } from "@aws-sdk/client-eks";

const describeAccessEntry: AppBlock = {
  name: "Describe Access Entry",
  description: "Describes an access entry.",
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

        const command = new DescribeAccessEntryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Access Entry Result",
      description: "Result from DescribeAccessEntry operation",
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
            description: "Information about the access entry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAccessEntry;
