import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetAccountSummaryCommand } from "@aws-sdk/client-iam";

const getAccountSummary: AppBlock = {
  name: "Get Account Summary",
  description:
    "Retrieves information about IAM entity usage and IAM quotas in the Amazon Web Services account.",
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

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetAccountSummaryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Summary Result",
      description: "Result from GetAccountSummary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SummaryMap: {
            type: "object",
            additionalProperties: {
              type: "number",
            },
            description:
              "A set of key–value pairs containing information about IAM entity usage and IAM quotas.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccountSummary;
