import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateDBSecurityGroupCommand } from "@aws-sdk/client-rds";

const createDBSecurityGroup: AppBlock = {
  name: "Create DB Security Group",
  description: "Creates a new DB security group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSecurityGroupName: {
          name: "DB Security Group Name",
          description: "The name for the DB security group.",
          type: "string",
          required: true,
        },
        DBSecurityGroupDescription: {
          name: "DB Security Group Description",
          description: "The description for the DB security group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the DB security group.",
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

        const command = new CreateDBSecurityGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create DB Security Group Result",
      description: "Result from CreateDBSecurityGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBSecurityGroup: {
            type: "object",
            properties: {
              OwnerId: {
                type: "string",
              },
              DBSecurityGroupName: {
                type: "string",
              },
              DBSecurityGroupDescription: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              EC2SecurityGroups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    EC2SecurityGroupName: {
                      type: "string",
                    },
                    EC2SecurityGroupId: {
                      type: "string",
                    },
                    EC2SecurityGroupOwnerId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              IPRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    CIDRIP: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              DBSecurityGroupArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the details for an Amazon RDS DB security group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDBSecurityGroup;
