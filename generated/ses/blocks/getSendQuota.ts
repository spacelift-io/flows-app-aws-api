import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, GetSendQuotaCommand } from "@aws-sdk/client-ses";

const getSendQuota: AppBlock = {
  name: "Get Send Quota",
  description: "Provides the sending limits for the Amazon SES account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
        });

        const command = new GetSendQuotaCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Send Quota Result",
      description: "Result from GetSendQuota operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Max24HourSend: {
            type: "number",
            description:
              "The maximum number of emails the user is allowed to send in a 24-hour interval.",
          },
          MaxSendRate: {
            type: "number",
            description:
              "The maximum number of emails that Amazon SES can accept from the user's account per second.",
          },
          SentLast24Hours: {
            type: "number",
            description:
              "The number of emails sent during the previous 24 hours.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSendQuota;
