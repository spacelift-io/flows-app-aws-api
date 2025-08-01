import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeEventsCommand } from "@aws-sdk/client-rds";

const describeEvents: AppBlock = {
  name: "Describe Events",
  description:
    "Returns events related to DB instances, DB clusters, DB parameter groups, DB security groups, DB snapshots, DB cluster snapshots, and RDS Proxies for the past 14 days.",
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
            "The identifier of the event source for which events are returned.",
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
          description: "The number of minutes to retrieve events for.",
          type: "number",
          required: false,
        },
        EventCategories: {
          name: "Event Categories",
          description:
            "A list of event categories that trigger notifications for a event notification subscription.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeEvents request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
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
              "An optional pagination token provided by a previous Events request.",
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
                Date: {
                  type: "string",
                },
                SourceArn: {
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
