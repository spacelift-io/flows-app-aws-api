import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  ListPhoneNumbersOptedOutCommand,
} from "@aws-sdk/client-sns";

const listPhoneNumbersOptedOut: AppBlock = {
  name: "List Phone Numbers Opted Out",
  description:
    "Returns a list of phone numbers that are opted out, meaning you cannot send SMS messages to them.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        nextToken: {
          name: "next Token",
          description:
            "A NextToken string is used when you call the ListPhoneNumbersOptedOut action to retrieve additional records that are available after the first page of results.",
          type: "string",
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

        const command = new ListPhoneNumbersOptedOutCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Phone Numbers Opted Out Result",
      description: "Result from ListPhoneNumbersOptedOut operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          phoneNumbers: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of phone numbers that are opted out of receiving SMS messages.",
          },
          nextToken: {
            type: "string",
            description:
              "A NextToken string is returned when you call the ListPhoneNumbersOptedOut action if additional records are available after the first page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPhoneNumbersOptedOut;
