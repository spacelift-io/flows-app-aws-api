import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListPartnerEventSourcesCommand,
} from "@aws-sdk/client-eventbridge";

const listPartnerEventSources: AppBlock = {
  name: "List Partner Event Sources",
  description:
    "An SaaS partner can use this operation to list all the partner event source names that they have created.",
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
            "If you specify this, the results are limited to only those partner event sources that start with the string you specify.",
          type: "string",
          required: true,
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
            "pecifying this limits the number of results returned by this operation.",
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

        const command = new ListPartnerEventSourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Partner Event Sources Result",
      description: "Result from ListPartnerEventSources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PartnerEventSources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of partner event sources returned by the operation.",
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

export default listPartnerEventSources;
