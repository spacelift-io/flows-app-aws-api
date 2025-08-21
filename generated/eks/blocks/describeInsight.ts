import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DescribeInsightCommand } from "@aws-sdk/client-eks";

const describeInsight: AppBlock = {
  name: "Describe Insight",
  description:
    "Returns details about an insight that you specify using its ID.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of the cluster to describe the insight for.",
          type: "string",
          required: true,
        },
        id: {
          name: "id",
          description: "The identity of the insight to describe.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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

        const command = new DescribeInsightCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Insight Result",
      description: "Result from DescribeInsight operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          insight: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              category: {
                type: "string",
              },
              kubernetesVersion: {
                type: "string",
              },
              lastRefreshTime: {
                type: "string",
              },
              lastTransitionTime: {
                type: "string",
              },
              description: {
                type: "string",
              },
              insightStatus: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                  },
                  reason: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              recommendation: {
                type: "string",
              },
              additionalInfo: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              resources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    insightStatus: {
                      type: "object",
                      properties: {
                        status: {
                          type: "object",
                          additionalProperties: true,
                        },
                        reason: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    kubernetesResourceUri: {
                      type: "string",
                    },
                    arn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              categorySpecificSummary: {
                type: "object",
                properties: {
                  deprecationDetails: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        usage: {
                          type: "object",
                          additionalProperties: true,
                        },
                        replacedWith: {
                          type: "object",
                          additionalProperties: true,
                        },
                        stopServingVersion: {
                          type: "object",
                          additionalProperties: true,
                        },
                        startServingReplacementVersion: {
                          type: "object",
                          additionalProperties: true,
                        },
                        clientStats: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  addonCompatibilityDetails: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        compatibleVersions: {
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
            },
            additionalProperties: false,
            description: "The full description of the insight.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInsight;
