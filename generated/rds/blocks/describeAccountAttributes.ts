import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeAccountAttributesCommand,
} from "@aws-sdk/client-rds";

const describeAccountAttributes: AppBlock = {
  name: "Describe Account Attributes",
  description: "Lists all of the attributes for a customer account.",
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

        const client = new RDSClient({
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

        const command = new DescribeAccountAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Account Attributes Result",
      description: "Result from DescribeAccountAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountQuotas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AccountQuotaName: {
                  type: "string",
                },
                Used: {
                  type: "number",
                },
                Max: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "A list of AccountQuota objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAccountAttributes;
