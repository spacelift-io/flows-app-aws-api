import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  VerifySMSSandboxPhoneNumberCommand,
} from "@aws-sdk/client-sns";

const verifySMSSandboxPhoneNumber: AppBlock = {
  name: "Verify SMS Sandbox Phone Number",
  description:
    "Verifies a destination phone number with a one-time password (OTP) for the calling Amazon Web Services account.",
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
        OneTimePassword: {
          name: "One Time Password",
          description:
            "The OTP sent to the destination number from the CreateSMSSandBoxPhoneNumber call.",
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
        });

        const command = new VerifySMSSandboxPhoneNumberCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify SMS Sandbox Phone Number Result",
      description: "Result from VerifySMSSandboxPhoneNumber operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default verifySMSSandboxPhoneNumber;
