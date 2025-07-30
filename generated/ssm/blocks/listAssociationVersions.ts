import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListAssociationVersionsCommand } from "@aws-sdk/client-ssm";

const listAssociationVersions: AppBlock = {
  name: "List Association Versions",
  description:
    "Retrieves all versions of an association for a specific association ID.",
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
            "The association ID for which you want to view all versions.",
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

        const command = new ListAssociationVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Association Versions Result",
      description: "Result from ListAssociationVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationVersions: {
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
                CreatedDate: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
                },
                Parameters: {
                  type: "object",
                  additionalProperties: {
                    type: "array",
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
                  additionalProperties: false,
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Regions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetLocationMaxConcurrency: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetLocationMaxErrors: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ExecutionRoleName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetLocationAlarmConfiguration: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IncludeChildOrganizationUnits: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ExcludeAccounts: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Targets: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetsMaxConcurrency: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetsMaxErrors: {
                        type: "object",
                        additionalProperties: true,
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
                      type: "object",
                    },
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about all versions of the association for the specified association ID.",
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

export default listAssociationVersions;
