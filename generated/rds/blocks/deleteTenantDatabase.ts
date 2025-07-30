import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteTenantDatabaseCommand } from "@aws-sdk/client-rds";

const deleteTenantDatabase: AppBlock = {
  name: "Delete Tenant Database",
  description: "Deletes a tenant database from your DB instance.",
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
            "The user-supplied identifier for the DB instance that contains the tenant database that you want to delete.",
          type: "string",
          required: true,
        },
        TenantDBName: {
          name: "Tenant DB Name",
          description:
            "The user-supplied name of the tenant database that you want to remove from your DB instance.",
          type: "string",
          required: true,
        },
        SkipFinalSnapshot: {
          name: "Skip Final Snapshot",
          description:
            "Specifies whether to skip the creation of a final DB snapshot before removing the tenant database from your DB instance.",
          type: "boolean",
          required: false,
        },
        FinalDBSnapshotIdentifier: {
          name: "Final DB Snapshot Identifier",
          description:
            "The DBSnapshotIdentifier of the new DBSnapshot created when the SkipFinalSnapshot parameter is disabled.",
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
        });

        const command = new DeleteTenantDatabaseCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Tenant Database Result",
      description: "Result from DeleteTenantDatabase operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TenantDatabase: {
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "A tenant database in the DB instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTenantDatabase;
