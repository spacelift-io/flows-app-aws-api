import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeClusterSubnetGroupsCommand,
} from "@aws-sdk/client-redshift";

const describeClusterSubnetGroups: AppBlock = {
  name: "Describe Cluster Subnet Groups",
  description: `Returns one or more cluster subnet group objects, which contain metadata about your cluster subnet groups.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterSubnetGroupName: {
          name: "Cluster Subnet Group Name",
          description:
            "The name of the cluster subnet group for which information is requested.",
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
        TagKeys: {
          name: "Tag Keys",
          description:
            "A tag key or keys for which you want to return all matching cluster subnet groups that are associated with the specified key or keys.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        TagValues: {
          name: "Tag Values",
          description:
            "A tag value or values for which you want to return all matching cluster subnet groups that are associated with the specified tag value or values.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new DescribeClusterSubnetGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Cluster Subnet Groups Result",
      description: "Result from DescribeClusterSubnetGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          ClusterSubnetGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClusterSubnetGroupName: {
                  type: "string",
                },
                Description: {
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
                      SubnetStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Tags: {
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
                SupportedClusterIpAddressTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of ClusterSubnetGroup instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClusterSubnetGroups;
