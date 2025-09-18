import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ListRecommendationsCommand,
} from "@aws-sdk/client-redshift";

const listRecommendations: AppBlock = {
  name: "List Recommendations",
  description: `List the Amazon Redshift Advisor recommendations for one or multiple Amazon Redshift clusters in an Amazon Web Services account.`,
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
            "The unique identifier of the Amazon Redshift cluster for which the list of Advisor recommendations is returned.",
          type: "string",
          required: false,
        },
        NamespaceArn: {
          name: "Namespace Arn",
          description:
            "The Amazon Redshift cluster namespace Amazon Resource Name (ARN) for which the list of Advisor recommendations is returned.",
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
            "A value that indicates the starting point for the next set of response records in a subsequent request.",
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

        const command = new ListRecommendationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Recommendations Result",
      description: "Result from ListRecommendations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                ClusterIdentifier: {
                  type: "string",
                },
                NamespaceArn: {
                  type: "string",
                },
                CreatedAt: {
                  type: "string",
                },
                RecommendationType: {
                  type: "string",
                },
                Title: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Observation: {
                  type: "string",
                },
                ImpactRanking: {
                  type: "string",
                },
                RecommendationText: {
                  type: "string",
                },
                RecommendedActions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Text: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Database: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Command: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReferenceLinks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Text: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Link: {
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
              "The Advisor recommendations for action on the Amazon Redshift cluster.",
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

export default listRecommendations;
