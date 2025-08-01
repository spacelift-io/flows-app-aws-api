import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  CancelQueryCommand,
} from "@aws-sdk/client-cloudtrail";

const cancelQuery: AppBlock = {
  name: "Cancel Query",
  description:
    "Cancels a query if the query is not in a terminated state, such as CANCELLED, FAILED, TIMED_OUT, or FINISHED.",
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
            "The ARN (or the ID suffix of the ARN) of an event data store on which the specified query is running.",
          type: "string",
          required: false,
        },
        QueryId: {
          name: "Query Id",
          description: "The ID of the query that you want to cancel.",
          type: "string",
          required: true,
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
        });

        const command = new CancelQueryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Query Result",
      description: "Result from CancelQuery operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryId: {
            type: "string",
            description: "The ID of the canceled query.",
          },
          QueryStatus: {
            type: "string",
            description:
              "Shows the status of a query after a CancelQuery request.",
          },
          EventDataStoreOwnerAccountId: {
            type: "string",
            description: "The account ID of the event data store owner.",
          },
        },
        required: ["QueryId", "QueryStatus"],
      },
    },
  },
};

export default cancelQuery;
