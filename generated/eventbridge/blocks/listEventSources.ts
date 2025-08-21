import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListEventSourcesCommand,
} from "@aws-sdk/client-eventbridge";

const listEventSources: AppBlock = {
  name: "List Event Sources",
  description:
    "You can use this to see all the partner event sources that have been shared with your Amazon Web Services account.",
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
          description:
            "Specifying this limits the results to only those partner event sources with names that start with the specified prefix.",
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
          description:
            "Specifying this limits the number of results returned by this operation.",
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

        const command = new ListEventSourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Event Sources Result",
      description: "Result from ListEventSources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventSources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                CreatedBy: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                ExpirationTime: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of event sources.",
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

export default listEventSources;
