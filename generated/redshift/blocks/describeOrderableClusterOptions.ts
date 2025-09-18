import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeOrderableClusterOptionsCommand,
} from "@aws-sdk/client-redshift";

const describeOrderableClusterOptions: AppBlock = {
  name: "Describe Orderable Cluster Options",
  description: `Returns a list of orderable cluster options.`,
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
          description: "The version filter value.",
          type: "string",
          required: false,
        },
        NodeType: {
          name: "Node Type",
          description: "The node type filter value.",
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

        const command = new DescribeOrderableClusterOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Orderable Cluster Options Result",
      description: "Result from DescribeOrderableClusterOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OrderableClusterOptions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClusterVersion: {
                  type: "string",
                },
                ClusterType: {
                  type: "string",
                },
                NodeType: {
                  type: "string",
                },
                AvailabilityZones: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SupportedPlatforms: {
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
            description:
              "An OrderableClusterOption structure containing information about orderable options for the cluster.",
          },
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeOrderableClusterOptions;
