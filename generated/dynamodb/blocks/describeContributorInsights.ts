import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeContributorInsightsCommand,
} from "@aws-sdk/client-dynamodb";

const describeContributorInsights: AppBlock = {
  name: "Describe Contributor Insights",
  description:
    "Returns information about contributor insights for a given table or global secondary index.",
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
          description: "The name of the table to describe.",
          type: "string",
          required: true,
        },
        IndexName: {
          name: "Index Name",
          description:
            "The name of the global secondary index to describe, if applicable.",
          type: "string",
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

        const command = new DescribeContributorInsightsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Contributor Insights Result",
      description: "Result from DescribeContributorInsights operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description: "The name of the table being described.",
          },
          IndexName: {
            type: "string",
            description:
              "The name of the global secondary index being described.",
          },
          ContributorInsightsRuleList: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of names of the associated contributor insights rules.",
          },
          ContributorInsightsStatus: {
            type: "string",
            description: "Current status of contributor insights.",
          },
          LastUpdateDateTime: {
            type: "string",
            description: "Timestamp of the last time the status was changed.",
          },
          FailureException: {
            type: "object",
            properties: {
              ExceptionName: {
                type: "string",
              },
              ExceptionDescription: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Returns information about the last failure that was encountered.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeContributorInsights;
