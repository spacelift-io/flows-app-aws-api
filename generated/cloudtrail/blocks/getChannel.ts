import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetChannelCommand,
} from "@aws-sdk/client-cloudtrail";

const getChannel: AppBlock = {
  name: "Get Channel",
  description: "Returns information about a specific channel.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Channel: {
          name: "Channel",
          description: "The ARN or UUID of a channel.",
          type: "string",
          required: true,
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

        const command = new GetChannelCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Channel Result",
      description: "Result from GetChannel operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChannelArn: {
            type: "string",
            description:
              "The ARN of an channel returned by a GetChannel request.",
          },
          Name: {
            type: "string",
            description: "The name of the CloudTrail channel.",
          },
          Source: {
            type: "string",
            description: "The source for the CloudTrail channel.",
          },
          SourceConfig: {
            type: "object",
            properties: {
              ApplyToAllRegions: {
                type: "boolean",
              },
              AdvancedEventSelectors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    FieldSelectors: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["FieldSelectors"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Provides information about the advanced event selectors configured for the channel, and whether the channel applies to all Regions or a single Region.",
          },
          Destinations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Type: {
                  type: "string",
                },
                Location: {
                  type: "string",
                },
              },
              required: ["Type", "Location"],
              additionalProperties: false,
            },
            description: "The destinations for the channel.",
          },
          IngestionStatus: {
            type: "object",
            properties: {
              LatestIngestionSuccessTime: {
                type: "string",
              },
              LatestIngestionSuccessEventID: {
                type: "string",
              },
              LatestIngestionErrorCode: {
                type: "string",
              },
              LatestIngestionAttemptTime: {
                type: "string",
              },
              LatestIngestionAttemptEventID: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "A table showing information about the most recent successful and failed attempts to ingest events.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getChannel;
