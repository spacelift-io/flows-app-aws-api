import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeAssociationCommand } from "@aws-sdk/client-ssm";

const describeAssociation: AppBlock = {
  name: "Describe Association",
  description:
    "Describes the association for the specified target or managed node.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the SSM document.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The managed node ID.",
          type: "string",
          required: false,
        },
        AssociationId: {
          name: "Association Id",
          description: "The association ID for which you want information.",
          type: "string",
          required: false,
        },
        AssociationVersion: {
          name: "Association Version",
          description: "Specify the association version to retrieve.",
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

        const command = new DescribeAssociationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Association Result",
      description: "Result from DescribeAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationDescription: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              InstanceId: {
                type: "string",
              },
              AssociationVersion: {
                type: "string",
              },
              Date: {
                type: "string",
              },
              LastUpdateAssociationDate: {
                type: "string",
              },
              Status: {
                type: "object",
                properties: {
                  Date: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                  Message: {
                    type: "string",
                  },
                  AdditionalInfo: {
                    type: "string",
                  },
                },
                required: ["Date", "Name", "Message"],
                additionalProperties: false,
              },
              Overview: {
                type: "object",
                properties: {
                  Status: {
                    type: "string",
                  },
                  DetailedStatus: {
                    type: "string",
                  },
                  AssociationStatusAggregatedCount: {
                    type: "object",
                    additionalProperties: {
                      type: "number",
                    },
                  },
                },
                additionalProperties: false,
              },
              DocumentVersion: {
                type: "string",
              },
              AutomationTargetParameterName: {
                type: "string",
              },
              Parameters: {
                type: "object",
                additionalProperties: {
                  type: "array",
                },
              },
              AssociationId: {
                type: "string",
              },
              Targets: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              ScheduleExpression: {
                type: "string",
              },
              OutputLocation: {
                type: "object",
                properties: {
                  S3Location: {
                    type: "object",
                    properties: {
                      OutputS3Region: {
                        type: "string",
                      },
                      OutputS3BucketName: {
                        type: "string",
                      },
                      OutputS3KeyPrefix: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              LastExecutionDate: {
                type: "string",
              },
              LastSuccessfulExecutionDate: {
                type: "string",
              },
              AssociationName: {
                type: "string",
              },
              MaxErrors: {
                type: "string",
              },
              MaxConcurrency: {
                type: "string",
              },
              ComplianceSeverity: {
                type: "string",
              },
              SyncCompliance: {
                type: "string",
              },
              ApplyOnlyAtCronInterval: {
                type: "boolean",
              },
              CalendarNames: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              TargetLocations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Accounts: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Regions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    TargetLocationMaxConcurrency: {
                      type: "string",
                    },
                    TargetLocationMaxErrors: {
                      type: "string",
                    },
                    ExecutionRoleName: {
                      type: "string",
                    },
                    TargetLocationAlarmConfiguration: {
                      type: "object",
                      properties: {
                        IgnorePollAlarmFailure: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Alarms: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Alarms"],
                      additionalProperties: false,
                    },
                    IncludeChildOrganizationUnits: {
                      type: "boolean",
                    },
                    ExcludeAccounts: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Targets: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    TargetsMaxConcurrency: {
                      type: "string",
                    },
                    TargetsMaxErrors: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ScheduleOffset: {
                type: "number",
              },
              Duration: {
                type: "number",
              },
              TargetMaps: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: {
                    type: "array",
                  },
                },
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
                      properties: {
                        Name: {
                          type: "object",
                          additionalProperties: true,
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
              TriggeredAlarms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                  },
                  required: ["Name", "State"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Information about the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAssociation;
