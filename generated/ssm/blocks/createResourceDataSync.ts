import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, CreateResourceDataSyncCommand } from "@aws-sdk/client-ssm";

const createResourceDataSync: AppBlock = {
  name: "Create Resource Data Sync",
  description:
    "A resource data sync helps you view data from multiple sources in a single location.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SyncName: {
          name: "Sync Name",
          description: "A name for the configuration.",
          type: "string",
          required: true,
        },
        S3Destination: {
          name: "S3Destination",
          description: "Amazon S3 configuration details for the sync.",
          type: {
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
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["BucketName", "SyncFormat", "Region"],
            additionalProperties: false,
          },
          required: false,
        },
        SyncType: {
          name: "Sync Type",
          description:
            "Specify SyncToDestination to create a resource data sync that synchronizes data to an S3 bucket for Inventory.",
          type: "string",
          required: false,
        },
        SyncSource: {
          name: "Sync Source",
          description:
            "Specify information about the data sources to synchronize.",
          type: {
            type: "object",
            properties: {
              SourceType: {
                type: "string",
              },
              AwsOrganizationsSource: {
                type: "object",
                properties: {
                  OrganizationSourceType: {
                    type: "string",
                  },
                  OrganizationalUnits: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        OrganizationalUnitId: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                required: ["OrganizationSourceType"],
                additionalProperties: false,
              },
              SourceRegions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              IncludeFutureRegions: {
                type: "boolean",
              },
              EnableAllOpsDataSources: {
                type: "boolean",
              },
            },
            required: ["SourceType", "SourceRegions"],
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateResourceDataSyncCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Resource Data Sync Result",
      description: "Result from CreateResourceDataSync operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createResourceDataSync;
