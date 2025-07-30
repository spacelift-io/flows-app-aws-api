import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateResourceDataSyncCommand } from "@aws-sdk/client-ssm";

const updateResourceDataSync: AppBlock = {
  name: "Update Resource Data Sync",
  description: "Update a resource data sync.",
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
          description: "The name of the resource data sync you want to update.",
          type: "string",
          required: true,
        },
        SyncType: {
          name: "Sync Type",
          description: "The type of resource data sync.",
          type: "string",
          required: true,
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
          required: true,
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

        const command = new UpdateResourceDataSyncCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Resource Data Sync Result",
      description: "Result from UpdateResourceDataSync operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateResourceDataSync;
