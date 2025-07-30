import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListPartnerEventSourceAccountsCommand,
} from "@aws-sdk/client-eventbridge";

const listPartnerEventSourceAccounts: AppBlock = {
  name: "List Partner Event Source Accounts",
  description:
    "An SaaS partner can use this operation to display the Amazon Web Services account ID that a particular partner event source name is associated with.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventSourceName: {
          name: "Event Source Name",
          description:
            "The name of the partner event source to display account information about.",
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
        });

        const command = new ListPartnerEventSourceAccountsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Partner Event Source Accounts Result",
      description: "Result from ListPartnerEventSourceAccounts operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PartnerEventSourceAccounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Account: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                ExpirationTime: {
                  type: "string",
                },
                State: {
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

export default listPartnerEventSourceAccounts;
