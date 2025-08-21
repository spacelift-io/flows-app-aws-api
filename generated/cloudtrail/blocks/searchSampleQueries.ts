import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  SearchSampleQueriesCommand,
} from "@aws-sdk/client-cloudtrail";

const searchSampleQueries: AppBlock = {
  name: "Search Sample Queries",
  description:
    "Searches sample queries and returns a list of sample queries that are sorted by relevance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SearchPhrase: {
          name: "Search Phrase",
          description:
            "The natural language phrase to use for the semantic search.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return on a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token you can use to get the next page of results.",
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

        const command = new SearchSampleQueriesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Search Sample Queries Result",
      description: "Result from SearchSampleQueries operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SearchResults: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                SQL: {
                  type: "string",
                },
                Relevance: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of objects containing the search results ordered from most relevant to least relevant.",
          },
          NextToken: {
            type: "string",
            description: "A token you can use to get the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default searchSampleQueries;
