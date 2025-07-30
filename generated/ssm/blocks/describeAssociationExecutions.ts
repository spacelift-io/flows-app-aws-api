import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeAssociationExecutionsCommand,
} from "@aws-sdk/client-ssm";

const describeAssociationExecutions: AppBlock = {
  name: "Describe Association Executions",
  description: "Views all executions for a specific association ID.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description:
            "The association ID for which you want to view execution history details.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "Filters for the request.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
              },
              required: ["Key", "Value", "Type"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
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
        });

        const command = new DescribeAssociationExecutionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Association Executions Result",
      description: "Result from DescribeAssociationExecutions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationExecutions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociationId: {
                  type: "string",
                },
                AssociationVersion: {
                  type: "string",
                },
                ExecutionId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                DetailedStatus: {
                  type: "string",
                },
                CreatedTime: {
                  type: "string",
                },
                LastExecutionDate: {
                  type: "string",
                },
                ResourceCountByStatus: {
                  type: "string",
                },
                AlarmConfiguration: {
                  type: "object",
                  properties: {
                    IgnorePollAlarmFailure: {
                      type: "boolean",
                    },
                    Alarms: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["Alarms"],
                  additionalProperties: false,
                },
                TriggeredAlarms: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name", "State"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the executions for the specified association ID.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAssociationExecutions;
