import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  DeleteSMSSandboxPhoneNumberCommand,
} from "@aws-sdk/client-sns";

const deleteSMSSandboxPhoneNumber: AppBlock = {
  name: "Delete SMS Sandbox Phone Number",
  description:
    "Deletes an Amazon Web Services account's verified or pending phone number from the SMS sandbox.",
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
          description: "The destination phone number to delete.",
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

        const command = new DeleteSMSSandboxPhoneNumberCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete SMS Sandbox Phone Number Result",
      description: "Result from DeleteSMSSandboxPhoneNumber operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteSMSSandboxPhoneNumber;
