import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StartQueryCommand,
} from "@aws-sdk/client-cloudtrail";

const startQuery: AppBlock = {
  name: "Start Query",
  description: "Starts a CloudTrail Lake query.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        QueryStatement: {
          name: "Query Statement",
          description: "The SQL code of your query.",
          type: "string",
          required: false,
        },
        DeliveryS3Uri: {
          name: "Delivery S3Uri",
          description:
            "The URI for the S3 bucket where CloudTrail delivers the query results.",
          type: "string",
          required: false,
        },
        QueryAlias: {
          name: "Query Alias",
          description: "The alias that identifies a query template.",
          type: "string",
          required: false,
        },
        QueryParameters: {
          name: "Query Parameters",
          description: "The query parameters for the specified QueryAlias.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new StartQueryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Query Result",
      description: "Result from StartQuery operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryId: {
            type: "string",
            description: "The ID of the started query.",
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

export default startQuery;
