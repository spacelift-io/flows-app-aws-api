import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeInstanceAssociationsStatusCommand,
} from "@aws-sdk/client-ssm";

const describeInstanceAssociationsStatus: AppBlock = {
  name: "Describe Instance Associations Status",
  description: "The status of the associations for the managed nodes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The managed node IDs for which you want association status information.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DescribeInstanceAssociationsStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Associations Status Result",
      description: "Result from DescribeInstanceAssociationsStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceAssociationStatusInfos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociationId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
                },
                AssociationVersion: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                ExecutionDate: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                DetailedStatus: {
                  type: "string",
                },
                ExecutionSummary: {
                  type: "string",
                },
                ErrorCode: {
                  type: "string",
                },
                OutputUrl: {
                  type: "object",
                  properties: {
                    S3OutputUrl: {
                      type: "object",
                      properties: {
                        OutputUrl: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                AssociationName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Status information about the association.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstanceAssociationsStatus;
