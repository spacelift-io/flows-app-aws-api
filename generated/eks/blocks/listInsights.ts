import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListInsightsCommand } from "@aws-sdk/client-eks";

const listInsights: AppBlock = {
  name: "List Insights",
  description:
    "Returns a list of all insights checked for against the specified cluster.",
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
          description:
            "The name of the Amazon EKS cluster associated with the insights.",
          type: "string",
          required: true,
        },
        filter: {
          name: "filter",
          description:
            "The criteria to filter your list of insights for your cluster.",
          type: {
            type: "object",
            properties: {
              categories: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              kubernetesVersions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              statuses: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of identity provider configurations returned by ListInsights in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated ListInsights request.",
          type: "string",
          required: false,
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

        const command = new ListInsightsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Insights Result",
      description: "Result from ListInsights operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
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
              },
              additionalProperties: false,
            },
            description: "The returned list of insights.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListInsights request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listInsights;
