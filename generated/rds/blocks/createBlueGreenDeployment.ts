import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  CreateBlueGreenDeploymentCommand,
} from "@aws-sdk/client-rds";

const createBlueGreenDeployment: AppBlock = {
  name: "Create Blue Green Deployment",
  description: "Creates a blue/green deployment.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BlueGreenDeploymentName: {
          name: "Blue Green Deployment Name",
          description: "The name of the blue/green deployment.",
          type: "string",
          required: true,
        },
        Source: {
          name: "Source",
          description:
            "The Amazon Resource Name (ARN) of the source production database.",
          type: "string",
          required: true,
        },
        TargetEngineVersion: {
          name: "Target Engine Version",
          description:
            "The engine version of the database in the green environment.",
          type: "string",
          required: false,
        },
        TargetDBParameterGroupName: {
          name: "Target DB Parameter Group Name",
          description:
            "The DB parameter group associated with the DB instance in the green environment.",
          type: "string",
          required: false,
        },
        TargetDBClusterParameterGroupName: {
          name: "Target DB Cluster Parameter Group Name",
          description:
            "The DB cluster parameter group associated with the Aurora DB cluster in the green environment.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the blue/green deployment.",
          type: {
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
          required: false,
        },
        TargetDBInstanceClass: {
          name: "Target DB Instance Class",
          description:
            "Specify the DB instance class for the databases in the green environment.",
          type: "string",
          required: false,
        },
        UpgradeTargetStorageConfig: {
          name: "Upgrade Target Storage Config",
          description:
            "Whether to upgrade the storage file system configuration on the green database.",
          type: "boolean",
          required: false,
        },
        TargetIops: {
          name: "Target Iops",
          description:
            "The amount of Provisioned IOPS (input/output operations per second) to allocate for the green DB instance.",
          type: "number",
          required: false,
        },
        TargetStorageType: {
          name: "Target Storage Type",
          description:
            "The storage type to associate with the green DB instance.",
          type: "string",
          required: false,
        },
        TargetAllocatedStorage: {
          name: "Target Allocated Storage",
          description:
            "The amount of storage in gibibytes (GiB) to allocate for the green DB instance.",
          type: "number",
          required: false,
        },
        TargetStorageThroughput: {
          name: "Target Storage Throughput",
          description:
            "The storage throughput value for the green DB instance.",
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
        });

        const command = new CreateBlueGreenDeploymentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Blue Green Deployment Result",
      description: "Result from CreateBlueGreenDeployment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BlueGreenDeployment: {
            type: "object",
            properties: {
              BlueGreenDeploymentIdentifier: {
                type: "string",
              },
              BlueGreenDeploymentName: {
                type: "string",
              },
              Source: {
                type: "string",
              },
              Target: {
                type: "string",
              },
              SwitchoverDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SourceMember: {
                      type: "string",
                    },
                    TargetMember: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Status: {
                type: "string",
              },
              StatusDetails: {
                type: "string",
              },
              CreateTime: {
                type: "string",
              },
              DeleteTime: {
                type: "string",
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
            description: "Details about a blue/green deployment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createBlueGreenDeployment;
