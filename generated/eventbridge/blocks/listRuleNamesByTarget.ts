import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListRuleNamesByTargetCommand,
} from "@aws-sdk/client-eventbridge";

const listRuleNamesByTarget: AppBlock = {
  name: "List Rule Names By Target",
  description: "Lists the rules for the specified target.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TargetArn: {
          name: "Target Arn",
          description: "The Amazon Resource Name (ARN) of the target resource.",
          type: "string",
          required: true,
        },
        EventBusName: {
          name: "Event Bus Name",
          description: "The name or ARN of the event bus to list rules for.",
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
        });

        const command = new ListRuleNamesByTargetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Rule Names By Target Result",
      description: "Result from ListRuleNamesByTarget operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RuleNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of the rules that can invoke the given target.",
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

export default listRuleNamesByTarget;
