import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBSubnetGroupCommand } from "@aws-sdk/client-rds";

const modifyDBSubnetGroup: AppBlock = {
  name: "Modify DB Subnet Group",
  description: "Modifies an existing DB subnet group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSubnetGroupName: {
          name: "DB Subnet Group Name",
          description: "The name for the DB subnet group.",
          type: "string",
          required: true,
        },
        DBSubnetGroupDescription: {
          name: "DB Subnet Group Description",
          description: "The description for the DB subnet group.",
          type: "string",
          required: false,
        },
        SubnetIds: {
          name: "Subnet Ids",
          description: "The EC2 subnet IDs for the DB subnet group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifyDBSubnetGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Subnet Group Result",
      description: "Result from ModifyDBSubnetGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBSubnetGroup: {
            type: "object",
            properties: {
              DBSubnetGroupName: {
                type: "string",
              },
              DBSubnetGroupDescription: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              SubnetGroupStatus: {
                type: "string",
              },
              Subnets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SubnetIdentifier: {
                      type: "string",
                    },
                    SubnetAvailabilityZone: {
                      type: "object",
                      properties: {
                        Name: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    SubnetOutpost: {
                      type: "object",
                      properties: {
                        Arn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    SubnetStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              DBSubnetGroupArn: {
                type: "string",
              },
              SupportedNetworkTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description:
              "Contains the details of an Amazon RDS DB subnet group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBSubnetGroup;
