import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  CheckIfPhoneNumberIsOptedOutCommand,
} from "@aws-sdk/client-sns";

const checkIfPhoneNumberIsOptedOut: AppBlock = {
  name: "Check If Phone Number Is Opted Out",
  description:
    "Accepts a phone number and indicates whether the phone holder has opted out of receiving SMS messages from your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        phoneNumber: {
          name: "phone Number",
          description:
            "The phone number for which you want to check the opt out status.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CheckIfPhoneNumberIsOptedOutCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Check If Phone Number Is Opted Out Result",
      description: "Result from CheckIfPhoneNumberIsOptedOut operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          isOptedOut: {
            type: "boolean",
            description:
              "Indicates whether the phone number is opted out: true – The phone number is opted out, meaning you cannot publish SMS messages to it.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default checkIfPhoneNumberIsOptedOut;
