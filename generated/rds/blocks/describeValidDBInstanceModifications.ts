import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeValidDBInstanceModificationsCommand,
} from "@aws-sdk/client-rds";

const describeValidDBInstanceModifications: AppBlock = {
  name: "Describe Valid DB Instance Modifications",
  description:
    "You can call DescribeValidDBInstanceModifications to learn what modifications you can make to your DB instance.",
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
            "The customer identifier or the ARN of your DB instance.",
          type: "string",
          required: true,
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

        const command = new DescribeValidDBInstanceModificationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Valid DB Instance Modifications Result",
      description: "Result from DescribeValidDBInstanceModifications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ValidDBInstanceModificationsMessage: {
            type: "object",
            properties: {
              Storage: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    StorageType: {
                      type: "string",
                    },
                    StorageSize: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    ProvisionedIops: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    IopsToStorageRatio: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    SupportsStorageAutoscaling: {
                      type: "boolean",
                    },
                    ProvisionedStorageThroughput: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    StorageThroughputToIopsRatio: {
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
              ValidProcessorFeatures: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    DefaultValue: {
                      type: "string",
                    },
                    AllowedValues: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              SupportsDedicatedLogVolume: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Information about valid modifications that you can make to your DB instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeValidDBInstanceModifications;
