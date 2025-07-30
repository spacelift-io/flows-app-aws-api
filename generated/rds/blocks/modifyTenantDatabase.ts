import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyTenantDatabaseCommand } from "@aws-sdk/client-rds";

const modifyTenantDatabase: AppBlock = {
  name: "Modify Tenant Database",
  description: "Modifies an existing tenant database in a DB instance.",
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
            "The identifier of the DB instance that contains the tenant database that you are modifying.",
          type: "string",
          required: true,
        },
        TenantDBName: {
          name: "Tenant DB Name",
          description:
            "The user-supplied name of the tenant database that you want to modify.",
          type: "string",
          required: true,
        },
        MasterUserPassword: {
          name: "Master User Password",
          description:
            "The new password for the master user of the specified tenant database in your DB instance.",
          type: "string",
          required: false,
        },
        NewTenantDBName: {
          name: "New Tenant DB Name",
          description:
            "The new name of the tenant database when renaming a tenant database.",
          type: "string",
          required: false,
        },
        ManageMasterUserPassword: {
          name: "Manage Master User Password",
          description:
            "Specifies whether to manage the master user password with Amazon Web Services Secrets Manager.",
          type: "boolean",
          required: false,
        },
        RotateMasterUserPassword: {
          name: "Rotate Master User Password",
          description:
            "Specifies whether to rotate the secret managed by Amazon Web Services Secrets Manager for the master user password.",
          type: "boolean",
          required: false,
        },
        MasterUserSecretKmsKeyId: {
          name: "Master User Secret Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager.",
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

        const command = new ModifyTenantDatabaseCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Tenant Database Result",
      description: "Result from ModifyTenantDatabase operation",
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

export default modifyTenantDatabase;
