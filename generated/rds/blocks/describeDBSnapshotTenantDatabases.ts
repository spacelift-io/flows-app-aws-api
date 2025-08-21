import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBSnapshotTenantDatabasesCommand,
} from "@aws-sdk/client-rds";

const describeDBSnapshotTenantDatabases: AppBlock = {
  name: "Describe DB Snapshot Tenant Databases",
  description: "Describes the tenant databases that exist in a DB snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBInstanceIdentifier: {
          name: "DB Instance Identifier",
          description:
            "The ID of the DB instance used to create the DB snapshots.",
          type: "string",
          required: false,
        },
        DBSnapshotIdentifier: {
          name: "DB Snapshot Identifier",
          description:
            "The ID of a DB snapshot that contains the tenant databases to describe.",
          type: "string",
          required: false,
        },
        SnapshotType: {
          name: "Snapshot Type",
          description: "The type of DB snapshots to be returned.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more tenant databases to describe.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeDBSnapshotTenantDatabases request.",
          type: "string",
          required: false,
        },
        DbiResourceId: {
          name: "Dbi Resource Id",
          description: "A specific DB resource identifier to describe.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new DescribeDBSnapshotTenantDatabasesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Snapshot Tenant Databases Result",
      description: "Result from DescribeDBSnapshotTenantDatabases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          DBSnapshotTenantDatabases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBSnapshotIdentifier: {
                  type: "string",
                },
                DBInstanceIdentifier: {
                  type: "string",
                },
                DbiResourceId: {
                  type: "string",
                },
                EngineName: {
                  type: "string",
                },
                SnapshotType: {
                  type: "string",
                },
                TenantDatabaseCreateTime: {
                  type: "string",
                },
                TenantDBName: {
                  type: "string",
                },
                MasterUsername: {
                  type: "string",
                },
                TenantDatabaseResourceId: {
                  type: "string",
                },
                CharacterSetName: {
                  type: "string",
                },
                DBSnapshotTenantDatabaseARN: {
                  type: "string",
                },
                NcharCharacterSetName: {
                  type: "string",
                },
                TagList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of DB snapshot tenant databases.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBSnapshotTenantDatabases;
