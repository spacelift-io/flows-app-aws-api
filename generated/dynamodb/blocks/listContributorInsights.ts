import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  ListContributorInsightsCommand,
} from "@aws-sdk/client-dynamodb";

const listContributorInsights: AppBlock = {
  name: "List Contributor Insights",
  description:
    "Returns a list of ContributorInsightsSummary for a table and all its global secondary indexes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the table.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to for the desired page, if there is one.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "Maximum number of results to return per page.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
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

        const command = new ListContributorInsightsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Contributor Insights Result",
      description: "Result from ListContributorInsights operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ContributorInsightsSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TableName: {
                  type: "string",
                },
                IndexName: {
                  type: "string",
                },
                ContributorInsightsStatus: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of ContributorInsightsSummary.",
          },
          NextToken: {
            type: "string",
            description: "A token to go to the next page if there is one.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listContributorInsights;
