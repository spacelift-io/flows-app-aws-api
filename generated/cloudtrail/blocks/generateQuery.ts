import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GenerateQueryCommand,
} from "@aws-sdk/client-cloudtrail";

const generateQuery: AppBlock = {
  name: "Generate Query",
  description: "Generates a query from a natural language prompt.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStores: {
          name: "Event Data Stores",
          description:
            "The ARN (or ID suffix of the ARN) of the event data store that you want to query.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Prompt: {
          name: "Prompt",
          description: "The prompt that you want to use to generate the query.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GenerateQueryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Query Result",
      description: "Result from GenerateQuery operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryStatement: {
            type: "string",
            description: "The SQL query statement generated from the prompt.",
          },
          QueryAlias: {
            type: "string",
            description: "An alias that identifies the prompt.",
          },
          EventDataStoreOwnerAccountId: {
            type: "string",
            description: "The account ID of the event data store owner.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateQuery;
