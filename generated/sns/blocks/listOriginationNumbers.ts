import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, ListOriginationNumbersCommand } from "@aws-sdk/client-sns";

const listOriginationNumbers: AppBlock = {
  name: "List Origination Numbers",
  description:
    "Lists the calling Amazon Web Services account's dedicated origination numbers and their metadata.",
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
            "Token that the previous ListOriginationNumbers request returns.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of origination numbers to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListOriginationNumbersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Origination Numbers Result",
      description: "Result from ListOriginationNumbers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "A NextToken string is returned when you call the ListOriginationNumbers operation if additional pages of records are available.",
          },
          PhoneNumbers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CreatedAt: {
                  type: "string",
                },
                PhoneNumber: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Iso2CountryCode: {
                  type: "string",
                },
                RouteType: {
                  type: "string",
                },
                NumberCapabilities: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the calling account's verified and pending origination numbers.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOriginationNumbers;
