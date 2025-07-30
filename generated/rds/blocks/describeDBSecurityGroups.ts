import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBSecurityGroupsCommand,
} from "@aws-sdk/client-rds";

const describeDBSecurityGroups: AppBlock = {
  name: "Describe DB Security Groups",
  description: "Returns a list of DBSecurityGroup descriptions.",
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
          description:
            "The name of the DB security group to return details for.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
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
            "An optional pagination token provided by a previous DescribeDBSecurityGroups request.",
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

        const command = new DescribeDBSecurityGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Security Groups Result",
      description: "Result from DescribeDBSecurityGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          DBSecurityGroups: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      EC2SecurityGroupName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EC2SecurityGroupId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EC2SecurityGroupOwnerId: {
                        type: "object",
                        additionalProperties: true,
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
                        type: "object",
                        additionalProperties: true,
                      },
                      CIDRIP: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "A list of DBSecurityGroup instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBSecurityGroups;
