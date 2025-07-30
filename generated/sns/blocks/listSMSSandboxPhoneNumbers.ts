import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  ListSMSSandboxPhoneNumbersCommand,
} from "@aws-sdk/client-sns";

const listSMSSandboxPhoneNumbers: AppBlock = {
  name: "List SMS Sandbox Phone Numbers",
  description:
    "Lists the calling Amazon Web Services account's current verified and pending destination phone numbers in the SMS sandbox.",
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
            "Token that the previous ListSMSSandboxPhoneNumbersInput request returns.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of phone numbers to return.",
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

        const command = new ListSMSSandboxPhoneNumbersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List SMS Sandbox Phone Numbers Result",
      description: "Result from ListSMSSandboxPhoneNumbers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PhoneNumbers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PhoneNumber: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the calling account's pending and verified phone numbers.",
          },
          NextToken: {
            type: "string",
            description:
              "A NextToken string is returned when you call the ListSMSSandboxPhoneNumbersInput operation if additional pages of records are available.",
          },
        },
        required: ["PhoneNumbers"],
      },
    },
  },
};

export default listSMSSandboxPhoneNumbers;
