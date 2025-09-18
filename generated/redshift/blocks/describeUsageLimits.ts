import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeUsageLimitsCommand,
} from "@aws-sdk/client-redshift";

const describeUsageLimits: AppBlock = {
  name: "Describe Usage Limits",
  description: `Shows usage limits on a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UsageLimitId: {
          name: "Usage Limit Id",
          description: "The identifier of the usage limit to describe.",
          type: "string",
          required: false,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The identifier of the cluster for which you want to describe usage limits.",
          type: "string",
          required: false,
        },
        FeatureType: {
          name: "Feature Type",
          description:
            "The feature type for which you want to describe usage limits.",
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
            "A tag key or keys for which you want to return all matching usage limit objects that are associated with the specified key or keys.",
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
            "A tag value or values for which you want to return all matching usage limit objects that are associated with the specified tag value or values.",
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

        const command = new DescribeUsageLimitsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Usage Limits Result",
      description: "Result from DescribeUsageLimits operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UsageLimits: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UsageLimitId: {
                  type: "string",
                },
                ClusterIdentifier: {
                  type: "string",
                },
                FeatureType: {
                  type: "string",
                },
                LimitType: {
                  type: "string",
                },
                Amount: {
                  type: "number",
                },
                Period: {
                  type: "string",
                },
                BreachAction: {
                  type: "string",
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
              },
              additionalProperties: false,
            },
            description:
              "Contains the output from the DescribeUsageLimits action.",
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

export default describeUsageLimits;
