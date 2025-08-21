import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeDBSubnetGroupsCommand } from "@aws-sdk/client-rds";

const describeDBSubnetGroups: AppBlock = {
  name: "Describe DB Subnet Groups",
  description: "Returns a list of DBSubnetGroup descriptions.",
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
          description: "The name of the DB subnet group to return details for.",
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
            "An optional pagination token provided by a previous DescribeDBSubnetGroups request.",
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

        const command = new DescribeDBSubnetGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Subnet Groups Result",
      description: "Result from DescribeDBSubnetGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          DBSubnetGroups: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetAvailabilityZone: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetOutpost: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetStatus: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "A list of DBSubnetGroup instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBSubnetGroups;
