import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListResourceDataSyncCommand } from "@aws-sdk/client-ssm";

const listResourceDataSync: AppBlock = {
  name: "List Resource Data Sync",
  description: "Lists your resource data sync configurations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SyncType: {
          name: "Sync Type",
          description:
            "View a list of resource data syncs according to the sync type.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
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

        const command = new ListResourceDataSyncCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Data Sync Result",
      description: "Result from ListResourceDataSync operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceDataSyncItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SyncName: {
                  type: "string",
                },
                SyncType: {
                  type: "string",
                },
                SyncSource: {
                  type: "object",
                  properties: {
                    SourceType: {
                      type: "string",
                    },
                    AwsOrganizationsSource: {
                      type: "object",
                      properties: {
                        OrganizationSourceType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OrganizationalUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["OrganizationSourceType"],
                      additionalProperties: false,
                    },
                    SourceRegions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    IncludeFutureRegions: {
                      type: "boolean",
                    },
                    State: {
                      type: "string",
                    },
                    EnableAllOpsDataSources: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                S3Destination: {
                  type: "object",
                  properties: {
                    BucketName: {
                      type: "string",
                    },
                    Prefix: {
                      type: "string",
                    },
                    SyncFormat: {
                      type: "string",
                    },
                    Region: {
                      type: "string",
                    },
                    AWSKMSKeyARN: {
                      type: "string",
                    },
                    DestinationDataSharing: {
                      type: "object",
                      properties: {
                        DestinationDataSharingType: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["BucketName", "SyncFormat", "Region"],
                  additionalProperties: false,
                },
                LastSyncTime: {
                  type: "string",
                },
                LastSuccessfulSyncTime: {
                  type: "string",
                },
                SyncLastModifiedTime: {
                  type: "string",
                },
                LastStatus: {
                  type: "string",
                },
                SyncCreatedTime: {
                  type: "string",
                },
                LastSyncStatusMessage: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of your current resource data sync configurations and their statuses.",
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

export default listResourceDataSync;
