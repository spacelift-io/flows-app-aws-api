import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  DescribeQueryCommand,
} from "@aws-sdk/client-cloudtrail";

const describeQuery: AppBlock = {
  name: "Describe Query",
  description:
    "Returns metadata about a query, including query run time in milliseconds, number of events scanned and matched, and query status.",
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
            "The ARN (or the ID suffix of the ARN) of an event data store on which the specified query was run.",
          type: "string",
          required: false,
        },
        QueryId: {
          name: "Query Id",
          description: "The query ID.",
          type: "string",
          required: false,
        },
        QueryAlias: {
          name: "Query Alias",
          description: "The alias that identifies a query template.",
          type: "string",
          required: false,
        },
        RefreshId: {
          name: "Refresh Id",
          description: "The ID of the dashboard refresh.",
          type: "string",
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

        const command = new DescribeQueryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Query Result",
      description: "Result from DescribeQuery operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryId: {
            type: "string",
            description: "The ID of the query.",
          },
          QueryString: {
            type: "string",
            description: "The SQL code of a query.",
          },
          QueryStatus: {
            type: "string",
            description: "The status of a query.",
          },
          QueryStatistics: {
            type: "object",
            properties: {
              EventsMatched: {
                type: "number",
              },
              EventsScanned: {
                type: "number",
              },
              BytesScanned: {
                type: "number",
              },
              ExecutionTimeInMillis: {
                type: "number",
              },
              CreationTime: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Metadata about a query, including the number of events that were matched, the total number of events scanned, the query run time in milliseconds, and the query's creation time.",
          },
          ErrorMessage: {
            type: "string",
            description: "The error message returned if a query failed.",
          },
          DeliveryS3Uri: {
            type: "string",
            description:
              "The URI for the S3 bucket where CloudTrail delivered query results, if applicable.",
          },
          DeliveryStatus: {
            type: "string",
            description: "The delivery status.",
          },
          Prompt: {
            type: "string",
            description: "The prompt used for a generated query.",
          },
          EventDataStoreOwnerAccountId: {
            type: "string",
            description: "The account ID of the event data store owner.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeQuery;
