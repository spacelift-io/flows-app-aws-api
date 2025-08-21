import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListReceiptRuleSetsCommand } from "@aws-sdk/client-ses";

const listReceiptRuleSets: AppBlock = {
  name: "List Receipt Rule Sets",
  description:
    "Lists the receipt rule sets that exist under your Amazon Web Services account in the current Amazon Web Services Region.",
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
            "A token returned from a previous call to ListReceiptRuleSets to indicate the position in the receipt rule set list.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
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

        const command = new ListReceiptRuleSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Receipt Rule Sets Result",
      description: "Result from ListReceiptRuleSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RuleSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                CreatedTimestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The metadata for the currently active receipt rule set.",
          },
          NextToken: {
            type: "string",
            description:
              "A token indicating that there are additional receipt rule sets available to be listed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listReceiptRuleSets;
