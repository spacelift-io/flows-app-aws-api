import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeEventsCommand,
} from "@aws-sdk/client-redshift";

const describeEvents: AppBlock = {
  name: "Describe Events",
  description: `Returns events related to clusters, security groups, snapshots, and parameter groups for the past 14 days.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceIdentifier: {
          name: "Source Identifier",
          description:
            "The identifier of the event source for which events will be returned.",
          type: "string",
          required: false,
        },
        SourceType: {
          name: "Source Type",
          description: "The event source to retrieve events for.",
          type: "string",
          required: false,
        },
        StartTime: {
          name: "Start Time",
          description:
            "The beginning of the time interval to retrieve events for, specified in ISO 8601 format.",
          type: "string",
          required: false,
        },
        EndTime: {
          name: "End Time",
          description:
            "The end of the time interval for which to retrieve events, specified in ISO 8601 format.",
          type: "string",
          required: false,
        },
        Duration: {
          name: "Duration",
          description:
            "The number of minutes prior to the time of the request for which to retrieve events.",
          type: "number",
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
            "An optional parameter that specifies the starting point to return a set of response records.",
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

        const command = new DescribeEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Events Result",
      description: "Result from DescribeEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          Events: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SourceIdentifier: {
                  type: "string",
                },
                SourceType: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
                EventCategories: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Severity: {
                  type: "string",
                },
                Date: {
                  type: "string",
                },
                EventId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of Event instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEvents;
