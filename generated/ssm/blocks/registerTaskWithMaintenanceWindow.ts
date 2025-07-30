import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  RegisterTaskWithMaintenanceWindowCommand,
} from "@aws-sdk/client-ssm";

const registerTaskWithMaintenanceWindow: AppBlock = {
  name: "Register Task With Maintenance Window",
  description: "Adds a new task to a maintenance window.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WindowId: {
          name: "Window Id",
          description:
            "The ID of the maintenance window the task should be added to.",
          type: "string",
          required: true,
        },
        Targets: {
          name: "Targets",
          description:
            "The targets (either managed nodes or maintenance window targets).",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        TaskArn: {
          name: "Task Arn",
          description: "The ARN of the task to run.",
          type: "string",
          required: true,
        },
        ServiceRoleArn: {
          name: "Service Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM service role for Amazon Web Services Systems Manager to assume when running a maintenance window task.",
          type: "string",
          required: false,
        },
        TaskType: {
          name: "Task Type",
          description: "The type of task being registered.",
          type: "string",
          required: true,
        },
        TaskParameters: {
          name: "Task Parameters",
          description:
            "The parameters that should be passed to the task when it is run.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        TaskInvocationParameters: {
          name: "Task Invocation Parameters",
          description:
            "The parameters that the task should use during execution.",
          type: {
            type: "object",
            properties: {
              RunCommand: {
                type: "object",
                properties: {
                  Comment: {
                    type: "string",
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
                  DocumentHash: {
                    type: "string",
                  },
                  DocumentHashType: {
                    type: "string",
                  },
                  DocumentVersion: {
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
                  OutputS3BucketName: {
                    type: "string",
                  },
                  OutputS3KeyPrefix: {
                    type: "string",
                  },
                  Parameters: {
                    type: "object",
                    additionalProperties: {
                      type: "array",
                    },
                  },
                  ServiceRoleArn: {
                    type: "string",
                  },
                  TimeoutSeconds: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              Automation: {
                type: "object",
                properties: {
                  DocumentVersion: {
                    type: "string",
                  },
                  Parameters: {
                    type: "object",
                    additionalProperties: {
                      type: "array",
                    },
                  },
                },
                additionalProperties: false,
              },
              StepFunctions: {
                type: "object",
                properties: {
                  Input: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Lambda: {
                type: "object",
                properties: {
                  ClientContext: {
                    type: "string",
                  },
                  Qualifier: {
                    type: "string",
                  },
                  Payload: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Priority: {
          name: "Priority",
          description:
            "The priority of the task in the maintenance window, the lower the number the higher the priority.",
          type: "number",
          required: false,
        },
        MaxConcurrency: {
          name: "Max Concurrency",
          description:
            "The maximum number of targets this task can be run for, in parallel.",
          type: "string",
          required: false,
        },
        MaxErrors: {
          name: "Max Errors",
          description:
            "The maximum number of errors allowed before this task stops being scheduled.",
          type: "string",
          required: false,
        },
        LoggingInfo: {
          name: "Logging Info",
          description:
            "A structure containing information about an Amazon Simple Storage Service (Amazon S3) bucket to write managed node-level logs to.",
          type: {
            type: "object",
            properties: {
              S3BucketName: {
                type: "string",
              },
              S3KeyPrefix: {
                type: "string",
              },
              S3Region: {
                type: "string",
              },
            },
            required: ["S3BucketName", "S3Region"],
            additionalProperties: false,
          },
          required: false,
        },
        Name: {
          name: "Name",
          description: "An optional name for the task.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "An optional description for the task.",
          type: "string",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description: "User-provided idempotency token.",
          type: "string",
          required: false,
        },
        CutoffBehavior: {
          name: "Cutoff Behavior",
          description:
            "Indicates whether tasks should continue to run after the cutoff time specified in the maintenance windows is reached.",
          type: "string",
          required: false,
        },
        AlarmConfiguration: {
          name: "Alarm Configuration",
          description:
            "The CloudWatch alarm you want to apply to your maintenance window task.",
          type: {
            type: "object",
            properties: {
              IgnorePollAlarmFailure: {
                type: "boolean",
              },
              Alarms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                  },
                  required: ["Name"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Alarms"],
            additionalProperties: false,
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
        });

        const command = new RegisterTaskWithMaintenanceWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Task With Maintenance Window Result",
      description: "Result from RegisterTaskWithMaintenanceWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowTaskId: {
            type: "string",
            description: "The ID of the task in the maintenance window.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerTaskWithMaintenanceWindow;
