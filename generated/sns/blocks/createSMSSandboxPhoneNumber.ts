import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  CreateSMSSandboxPhoneNumberCommand,
} from "@aws-sdk/client-sns";

const createSMSSandboxPhoneNumber: AppBlock = {
  name: "Create SMS Sandbox Phone Number",
  description:
    "Adds a destination phone number to an Amazon Web Services account in the SMS sandbox and sends a one-time password (OTP) to that phone number.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PhoneNumber: {
          name: "Phone Number",
          description: "The destination phone number to verify.",
          type: "string",
          required: true,
        },
        LanguageCode: {
          name: "Language Code",
          description: "The language to use for sending the OTP.",
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

        const command = new CreateSMSSandboxPhoneNumberCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create SMS Sandbox Phone Number Result",
      description: "Result from CreateSMSSandboxPhoneNumber operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createSMSSandboxPhoneNumber;
