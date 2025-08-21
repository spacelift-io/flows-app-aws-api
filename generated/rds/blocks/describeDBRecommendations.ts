import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBRecommendationsCommand,
} from "@aws-sdk/client-rds";

const describeDBRecommendations: AppBlock = {
  name: "Describe DB Recommendations",
  description:
    "Describes the recommendations to resolve the issues for your DB instances, DB clusters, and DB parameter groups.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LastUpdatedAfter: {
          name: "Last Updated After",
          description:
            "A filter to include only the recommendations that were updated after this specified time.",
          type: "string",
          required: false,
        },
        LastUpdatedBefore: {
          name: "Last Updated Before",
          description:
            "A filter to include only the recommendations that were updated before this specified time.",
          type: "string",
          required: false,
        },
        Locale: {
          name: "Locale",
          description:
            "The language that you choose to return the list of recommendations.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more recommendations to describe.",
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
            "The maximum number of recommendations to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeDBRecommendations request.",
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

        const command = new DescribeDBRecommendationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Recommendations Result",
      description: "Result from DescribeDBRecommendations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBRecommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RecommendationId: {
                  type: "string",
                },
                TypeId: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                ResourceArn: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                CreatedTime: {
                  type: "string",
                },
                UpdatedTime: {
                  type: "string",
                },
                Detection: {
                  type: "string",
                },
                Recommendation: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Reason: {
                  type: "string",
                },
                RecommendedActions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ActionId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Title: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Operation: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Parameters: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ApplyModes: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IssueDetails: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ContextAttributes: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Category: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                TypeDetection: {
                  type: "string",
                },
                TypeRecommendation: {
                  type: "string",
                },
                Impact: {
                  type: "string",
                },
                AdditionalInfo: {
                  type: "string",
                },
                Links: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Text: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Url: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                IssueDetails: {
                  type: "object",
                  properties: {
                    PerformanceIssueDetails: {
                      type: "object",
                      properties: {
                        StartTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EndTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Metrics: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Analysis: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of recommendations which is returned from DescribeDBRecommendations API request.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DBRecommendationsMessage request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBRecommendations;
