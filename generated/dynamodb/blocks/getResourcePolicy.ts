import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  GetResourcePolicyCommand,
} from "@aws-sdk/client-dynamodb";

const getResourcePolicy: AppBlock = {
  name: "Get Resource Policy",
  description:
    "Returns the resource-based policy document attached to the resource, which can be a table or stream, in JSON format.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the DynamoDB resource to which the policy is attached.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Policy Result",
      description: "Result from GetResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "string",
            description:
              "The resource-based policy document attached to the resource, which can be a table or stream, in JSON format.",
          },
          RevisionId: {
            type: "string",
            description:
              "A unique string that represents the revision ID of the policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResourcePolicy;
