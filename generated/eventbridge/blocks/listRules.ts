import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListRulesCommand,
} from "@aws-sdk/client-eventbridge";

const listRules: AppBlock = {
  name: "List Rules",
  description: "Lists your Amazon EventBridge rules.",
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
          description: "The prefix matching the rule name.",
          type: "string",
          required: false,
        },
        EventBusName: {
          name: "Event Bus Name",
          description:
            "The name or ARN of the event bus to list the rules for.",
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

        const command = new ListRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Rules Result",
      description: "Result from ListRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Rules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                EventPattern: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                ScheduleExpression: {
                  type: "string",
                },
                RoleArn: {
                  type: "string",
                },
                ManagedBy: {
                  type: "string",
                },
                EventBusName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The rules that match the specified criteria.",
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

export default listRules;
