import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, GetSMSAttributesCommand } from "@aws-sdk/client-sns";

const getSMSAttributes: AppBlock = {
  name: "Get SMS Attributes",
  description:
    "Returns the settings for sending SMS messages from your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        attributes: {
          name: "attributes",
          description:
            "A list of the individual attribute names, such as MonthlySpendLimit, for which you want values.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new GetSMSAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get SMS Attributes Result",
      description: "Result from GetSMSAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The SMS attribute names and their values.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSMSAttributes;
