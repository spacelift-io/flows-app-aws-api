import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeClusterVersionsCommand,
} from "@aws-sdk/client-redshift";

const describeClusterVersions: AppBlock = {
  name: "Describe Cluster Versions",
  description: `Returns descriptions of the available Amazon Redshift cluster versions.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterVersion: {
          name: "Cluster Version",
          description: "The specific cluster version to return.",
          type: "string",
          required: false,
        },
        ClusterParameterGroupFamily: {
          name: "Cluster Parameter Group Family",
          description:
            "The name of a specific cluster parameter group family to return details for.",
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
            "An optional parameter that specifies the starting point to return a set of response records.",
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

        const command = new DescribeClusterVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Cluster Versions Result",
      description: "Result from DescribeClusterVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          ClusterVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClusterVersion: {
                  type: "string",
                },
                ClusterParameterGroupFamily: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of Version elements.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClusterVersions;
