import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListCommandInvocationsCommand } from "@aws-sdk/client-ssm";

const listCommandInvocations: AppBlock = {
  name: "List Command Invocations",
  description:
    "An invocation is copy of a command sent to a specific managed node.",
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
          description: "(Optional) The invocations for a specific command ID.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "(Optional) The command execution details for a specific managed node ID.",
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
        Details: {
          name: "Details",
          description:
            "(Optional) If set this returns the response of the command executions and any command output.",
          type: "boolean",
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

        const command = new ListCommandInvocationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Command Invocations Result",
      description: "Result from ListCommandInvocations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CommandInvocations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CommandId: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                InstanceName: {
                  type: "string",
                },
                Comment: {
                  type: "string",
                },
                DocumentName: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
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
                TraceOutput: {
                  type: "string",
                },
                StandardOutputUrl: {
                  type: "string",
                },
                StandardErrorUrl: {
                  type: "string",
                },
                CommandPlugins: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StatusDetails: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ResponseCode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ResponseStartDateTime: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ResponseFinishDateTime: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Output: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StandardOutputUrl: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StandardErrorUrl: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OutputS3Region: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OutputS3BucketName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OutputS3KeyPrefix: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
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
              },
              additionalProperties: false,
            },
            description: "(Optional) A list of all invocations.",
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

export default listCommandInvocations;
