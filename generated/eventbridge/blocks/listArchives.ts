import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListArchivesCommand,
} from "@aws-sdk/client-eventbridge";

const listArchives: AppBlock = {
  name: "List Archives",
  description: "Lists your archives.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamePrefix: {
          name: "Name Prefix",
          description: "A name prefix to filter the archives returned.",
          type: "string",
          required: false,
        },
        EventSourceArn: {
          name: "Event Source Arn",
          description:
            "The ARN of the event source associated with the archive.",
          type: "string",
          required: false,
        },
        State: {
          name: "State",
          description: "The state of the archive.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call, which you can use to retrieve the next set of results.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "The maximum number of results to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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

        const command = new ListArchivesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Archives Result",
      description: "Result from ListArchives operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Archives: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ArchiveName: {
                  type: "string",
                },
                EventSourceArn: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                RetentionDays: {
                  type: "number",
                },
                SizeBytes: {
                  type: "number",
                },
                EventCount: {
                  type: "number",
                },
                CreationTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array of Archive objects that include details about an archive.",
          },
          NextToken: {
            type: "string",
            description: "A token indicating there are more results available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listArchives;
