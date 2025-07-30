import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeLimitsCommand,
} from "@aws-sdk/client-dynamodb";

const describeLimits: AppBlock = {
  name: "Describe Limits",
  description:
    "Returns the current provisioned-capacity quotas for your Amazon Web Services account in a Region, both for the Region as a whole and for any one DynamoDB table that you create there.",
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

        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeLimitsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Limits Result",
      description: "Result from DescribeLimits operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountMaxReadCapacityUnits: {
            type: "number",
            description:
              "The maximum total read capacity units that your account allows you to provision across all of your tables in this Region.",
          },
          AccountMaxWriteCapacityUnits: {
            type: "number",
            description:
              "The maximum total write capacity units that your account allows you to provision across all of your tables in this Region.",
          },
          TableMaxReadCapacityUnits: {
            type: "number",
            description:
              "The maximum read capacity units that your account allows you to provision for a new table that you are creating in this Region, including the read capacity units provisioned for its global secondary indexes (GSIs).",
          },
          TableMaxWriteCapacityUnits: {
            type: "number",
            description:
              "The maximum write capacity units that your account allows you to provision for a new table that you are creating in this Region, including the write capacity units provisioned for its global secondary indexes (GSIs).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeLimits;
