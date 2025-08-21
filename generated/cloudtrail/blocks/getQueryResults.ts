import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetQueryResultsCommand,
} from "@aws-sdk/client-cloudtrail";

const getQueryResults: AppBlock = {
  name: "Get Query Results",
  description: "Gets event data results of a query.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The ARN (or ID suffix of the ARN) of the event data store against which the query was run.",
          type: "string",
          required: false,
        },
        QueryId: {
          name: "Query Id",
          description: "The ID of the query for which you want to get results.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token you can use to get the next page of query results.",
          type: "string",
          required: false,
        },
        MaxQueryResults: {
          name: "Max Query Results",
          description:
            "The maximum number of query results to display on a single page.",
          type: "number",
          required: false,
        },
        EventDataStoreOwnerAccountId: {
          name: "Event Data Store Owner Account Id",
          description: "The account ID of the event data store owner.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new GetQueryResultsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Query Results Result",
      description: "Result from GetQueryResults operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryStatus: {
            type: "string",
            description: "The status of the query.",
          },
          QueryStatistics: {
            type: "object",
            properties: {
              ResultsCount: {
                type: "number",
              },
              TotalResultsCount: {
                type: "number",
              },
              BytesScanned: {
                type: "number",
              },
            },
            additionalProperties: false,
            description: "Shows the count of query results.",
          },
          QueryResultRows: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
            description: "Contains the individual event results of the query.",
          },
          NextToken: {
            type: "string",
            description:
              "A token you can use to get the next page of query results.",
          },
          ErrorMessage: {
            type: "string",
            description: "The error message returned if a query failed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getQueryResults;
