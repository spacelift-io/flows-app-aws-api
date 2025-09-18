import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeClusterDbRevisionsCommand,
} from "@aws-sdk/client-redshift";

const describeClusterDbRevisions: AppBlock = {
  name: "Describe Cluster Db Revisions",
  description: `Returns an array of ClusterDbRevision objects.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "A unique identifier for a cluster whose ClusterDbRevisions you are requesting.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional parameter that specifies the starting point for returning a set of response records.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeClusterDbRevisionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Cluster Db Revisions Result",
      description: "Result from DescribeClusterDbRevisions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A string representing the starting point for the next set of revisions.",
          },
          ClusterDbRevisions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClusterIdentifier: {
                  type: "string",
                },
                CurrentDatabaseRevision: {
                  type: "string",
                },
                DatabaseRevisionReleaseDate: {
                  type: "string",
                },
                RevisionTargets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      DatabaseRevision: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DatabaseRevisionReleaseDate: {
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
            description: "A list of revisions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClusterDbRevisions;
