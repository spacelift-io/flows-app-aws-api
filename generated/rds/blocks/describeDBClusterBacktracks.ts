import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBClusterBacktracksCommand,
} from "@aws-sdk/client-rds";

const describeDBClusterBacktracks: AppBlock = {
  name: "Describe DB Cluster Backtracks",
  description: "Returns information about backtracks for a DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterIdentifier: {
          name: "DB Cluster Identifier",
          description:
            "The DB cluster identifier of the DB cluster to be described.",
          type: "string",
          required: true,
        },
        BacktrackIdentifier: {
          name: "Backtrack Identifier",
          description:
            "If specified, this value is the backtrack identifier of the backtrack to be described.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more DB clusters to describe.",
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
            "An optional pagination token provided by a previous DescribeDBClusterBacktracks request.",
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

        const command = new DescribeDBClusterBacktracksCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Cluster Backtracks Result",
      description: "Result from DescribeDBClusterBacktracks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DescribeDBClusterBacktracks request.",
          },
          DBClusterBacktracks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBClusterIdentifier: {
                  type: "string",
                },
                BacktrackIdentifier: {
                  type: "string",
                },
                BacktrackTo: {
                  type: "string",
                },
                BacktrackedFrom: {
                  type: "string",
                },
                BacktrackRequestCreationTime: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Contains a list of backtracks for the user.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBClusterBacktracks;
