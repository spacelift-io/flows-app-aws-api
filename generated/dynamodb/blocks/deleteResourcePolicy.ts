import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DeleteResourcePolicyCommand,
} from "@aws-sdk/client-dynamodb";

const deleteResourcePolicy: AppBlock = {
  name: "Delete Resource Policy",
  description:
    "Deletes the resource-based policy attached to the resource, which can be a table or stream.",
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
            "The Amazon Resource Name (ARN) of the DynamoDB resource from which the policy will be removed.",
          type: "string",
          required: true,
        },
        ExpectedRevisionId: {
          name: "Expected Revision Id",
          description:
            "A string value that you can use to conditionally delete your policy.",
          type: "string",
          required: false,
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

        const command = new DeleteResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Resource Policy Result",
      description: "Result from DeleteResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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

export default deleteResourcePolicy;
