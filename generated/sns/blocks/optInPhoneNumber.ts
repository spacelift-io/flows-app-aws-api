import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, OptInPhoneNumberCommand } from "@aws-sdk/client-sns";

const optInPhoneNumber: AppBlock = {
  name: "Opt In Phone Number",
  description:
    "Use this request to opt in a phone number that is opted out, which enables you to resume sending SMS messages to the number.",
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
          description: "The phone number to opt in.",
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

        const command = new OptInPhoneNumberCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Opt In Phone Number Result",
      description: "Result from OptInPhoneNumber operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default optInPhoneNumber;
