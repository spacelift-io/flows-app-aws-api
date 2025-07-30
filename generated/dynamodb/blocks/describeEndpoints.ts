import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeEndpointsCommand,
} from "@aws-sdk/client-dynamodb";

const describeEndpoints: AppBlock = {
  name: "Describe Endpoints",
  description: "Returns the regional endpoint information.",
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

        const command = new DescribeEndpointsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Endpoints Result",
      description: "Result from DescribeEndpoints operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Endpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Address: {
                  type: "string",
                },
                CachePeriodInMinutes: {
                  type: "number",
                },
              },
              required: ["Address", "CachePeriodInMinutes"],
              additionalProperties: false,
            },
            description: "List of endpoints.",
          },
        },
        required: ["Endpoints"],
      },
    },
  },
};

export default describeEndpoints;
