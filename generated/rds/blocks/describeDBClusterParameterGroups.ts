import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBClusterParameterGroupsCommand,
} from "@aws-sdk/client-rds";

const describeDBClusterParameterGroups: AppBlock = {
  name: "Describe DB Cluster Parameter Groups",
  description: "Returns a list of DBClusterParameterGroup descriptions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterParameterGroupName: {
          name: "DB Cluster Parameter Group Name",
          description:
            "The name of a specific DB cluster parameter group to return details for.",
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
            "An optional pagination token provided by a previous DescribeDBClusterParameterGroups request.",
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

        const command = new DescribeDBClusterParameterGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Cluster Parameter Groups Result",
      description: "Result from DescribeDBClusterParameterGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeDBClusterParameterGroups request.",
          },
          DBClusterParameterGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBClusterParameterGroupName: {
                  type: "string",
                },
                DBParameterGroupFamily: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                DBClusterParameterGroupArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of DB cluster parameter groups.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBClusterParameterGroups;
