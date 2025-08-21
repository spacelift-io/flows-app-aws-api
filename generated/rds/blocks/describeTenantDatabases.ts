import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeTenantDatabasesCommand } from "@aws-sdk/client-rds";

const describeTenantDatabases: AppBlock = {
  name: "Describe Tenant Databases",
  description:
    "Describes the tenant databases in a DB instance that uses the multi-tenant configuration.",
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
            "The user-supplied DB instance identifier, which must match the identifier of an existing instance owned by the Amazon Web Services account.",
          type: "string",
          required: false,
        },
        TenantDBName: {
          name: "Tenant DB Name",
          description:
            "The user-supplied tenant database name, which must match the name of an existing tenant database on the specified DB instance owned by your Amazon Web Services account.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more database tenants to describe.",
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
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeTenantDatabases request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
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

        const command = new DescribeTenantDatabasesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Tenant Databases Result",
      description: "Result from DescribeTenantDatabases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeTenantDatabases request.",
          },
          TenantDatabases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TenantDatabaseCreateTime: {
                  type: "string",
                },
                DBInstanceIdentifier: {
                  type: "string",
                },
                TenantDBName: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                MasterUsername: {
                  type: "string",
                },
                DbiResourceId: {
                  type: "string",
                },
                TenantDatabaseResourceId: {
                  type: "string",
                },
                TenantDatabaseARN: {
                  type: "string",
                },
                CharacterSetName: {
                  type: "string",
                },
                NcharCharacterSetName: {
                  type: "string",
                },
                DeletionProtection: {
                  type: "boolean",
                },
                PendingModifiedValues: {
                  type: "object",
                  properties: {
                    MasterUserPassword: {
                      type: "string",
                    },
                    TenantDBName: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                MasterUserSecret: {
                  type: "object",
                  properties: {
                    SecretArn: {
                      type: "string",
                    },
                    SecretStatus: {
                      type: "string",
                    },
                    KmsKeyId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
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
            description:
              "An array of the tenant databases requested by the DescribeTenantDatabases operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTenantDatabases;
