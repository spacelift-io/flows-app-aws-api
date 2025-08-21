import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListCommandsCommand } from "@aws-sdk/client-ssm";

const listCommands: AppBlock = {
  name: "List Commands",
  description:
    "Lists the commands requested by users of the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CommandId: {
          name: "Command Id",
          description:
            "(Optional) If provided, lists only the specified command.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "(Optional) Lists commands issued against this managed node ID.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "(Optional) The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "(Optional) The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "(Optional) One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
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

        const command = new ListCommandsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Commands Result",
      description: "Result from ListCommands operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Commands: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CommandId: {
                  type: "string",
                },
                DocumentName: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
                },
                Comment: {
                  type: "string",
                },
                ExpiresAfter: {
                  type: "string",
                },
                Parameters: {
                  type: "object",
                  additionalProperties: {
                    type: "array",
                  },
                },
                InstanceIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                RequestedDateTime: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusDetails: {
                  type: "string",
                },
                OutputS3Region: {
                  type: "string",
                },
                OutputS3BucketName: {
                  type: "string",
                },
                OutputS3KeyPrefix: {
                  type: "string",
                },
                MaxConcurrency: {
                  type: "string",
                },
                MaxErrors: {
                  type: "string",
                },
                TargetCount: {
                  type: "number",
                },
                CompletedCount: {
                  type: "number",
                },
                ErrorCount: {
                  type: "number",
                },
                DeliveryTimedOutCount: {
                  type: "number",
                },
                ServiceRole: {
                  type: "string",
                },
                NotificationConfig: {
                  type: "object",
                  properties: {
                    NotificationArn: {
                      type: "string",
                    },
                    NotificationEvents: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    NotificationType: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                CloudWatchOutputConfig: {
                  type: "object",
                  properties: {
                    CloudWatchLogGroupName: {
                      type: "string",
                    },
                    CloudWatchOutputEnabled: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                TimeoutSeconds: {
                  type: "number",
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
              "(Optional) The list of commands requested by the user.",
          },
          NextToken: {
            type: "string",
            description:
              "(Optional) The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCommands;
