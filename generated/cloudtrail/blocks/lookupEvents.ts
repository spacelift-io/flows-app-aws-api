import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";

const lookupEvents: AppBlock = {
  name: "Lookup Events",
  description:
    "Looks up management events or CloudTrail Insights events that are captured by CloudTrail.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LookupAttributes: {
          name: "Lookup Attributes",
          description: "Contains a list of lookup attributes.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeKey: {
                  type: "string",
                },
                AttributeValue: {
                  type: "string",
                },
              },
              required: ["AttributeKey", "AttributeValue"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        StartTime: {
          name: "Start Time",
          description:
            "Specifies that only events that occur after or at the specified time are returned.",
          type: "string",
          required: false,
        },
        EndTime: {
          name: "End Time",
          description:
            "Specifies that only events that occur before or at the specified time are returned.",
          type: "string",
          required: false,
        },
        EventCategory: {
          name: "Event Category",
          description: "Specifies the event category.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The number of events to return.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token to use to get the next page of results after a previous API call.",
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

        const command = new LookupEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Lookup Events Result",
      description: "Result from LookupEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Events: {
            type: "array",
            items: {
              type: "object",
              properties: {
                EventId: {
                  type: "string",
                },
                EventName: {
                  type: "string",
                },
                ReadOnly: {
                  type: "string",
                },
                AccessKeyId: {
                  type: "string",
                },
                EventTime: {
                  type: "string",
                },
                EventSource: {
                  type: "string",
                },
                Username: {
                  type: "string",
                },
                Resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ResourceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ResourceName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                CloudTrailEvent: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of events returned based on the lookup attributes specified and the CloudTrail event.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to get the next page of results after a previous API call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default lookupEvents;
