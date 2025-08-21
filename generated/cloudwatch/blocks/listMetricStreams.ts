import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  ListMetricStreamsCommand,
} from "@aws-sdk/client-cloudwatch";

const listMetricStreams: AppBlock = {
  name: "List Metric Streams",
  description: "Returns a list of metric streams in this account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Include this value, if it was returned by the previous call, to get the next set of metric streams.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in one operation.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
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

        const command = new ListMetricStreamsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Metric Streams Result",
      description: "Result from ListMetricStreams operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token that marks the start of the next batch of returned results.",
          },
          Entries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
                LastUpdateDate: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                FirehoseArn: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                OutputFormat: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The array of metric stream information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listMetricStreams;
