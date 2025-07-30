import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  UpdateContributorInsightsCommand,
} from "@aws-sdk/client-dynamodb";

const updateContributorInsights: AppBlock = {
  name: "Update Contributor Insights",
  description:
    "Updates the status for contributor insights for a specific table or index.",
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
          required: true,
        },
        IndexName: {
          name: "Index Name",
          description: "The global secondary index name, if applicable.",
          type: "string",
          required: false,
        },
        ContributorInsightsAction: {
          name: "Contributor Insights Action",
          description: "Represents the contributor insights action.",
          type: "string",
          required: true,
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
        });

        const command = new UpdateContributorInsightsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Contributor Insights Result",
      description: "Result from UpdateContributorInsights operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description: "The name of the table.",
          },
          IndexName: {
            type: "string",
            description:
              "The name of the global secondary index, if applicable.",
          },
          ContributorInsightsStatus: {
            type: "string",
            description: "The status of contributor insights",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateContributorInsights;
