import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeDBShardGroupsCommand } from "@aws-sdk/client-rds";

const describeDBShardGroups: AppBlock = {
  name: "Describe DB Shard Groups",
  description: "Describes existing Aurora Limitless Database DB shard groups.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBShardGroupIdentifier: {
          name: "DB Shard Group Identifier",
          description: "The user-supplied DB shard group identifier.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more DB shard groups to describe.",
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
            "An optional pagination token provided by a previous DescribeDBShardGroups request.",
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

        const command = new DescribeDBShardGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Shard Groups Result",
      description: "Result from DescribeDBShardGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBShardGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBShardGroupResourceId: {
                  type: "string",
                },
                DBShardGroupIdentifier: {
                  type: "string",
                },
                DBClusterIdentifier: {
                  type: "string",
                },
                MaxACU: {
                  type: "number",
                },
                MinACU: {
                  type: "number",
                },
                ComputeRedundancy: {
                  type: "number",
                },
                Status: {
                  type: "string",
                },
                PubliclyAccessible: {
                  type: "boolean",
                },
                Endpoint: {
                  type: "string",
                },
                DBShardGroupArn: {
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
            description: "Contains a list of DB shard groups for the user.",
          },
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DescribeDBClusters request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBShardGroups;
