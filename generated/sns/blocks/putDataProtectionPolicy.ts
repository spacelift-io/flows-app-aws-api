import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, PutDataProtectionPolicyCommand } from "@aws-sdk/client-sns";

const putDataProtectionPolicy: AppBlock = {
  name: "Put Data Protection Policy",
  description:
    "Adds or updates an inline policy document that is stored in the specified Amazon SNS topic.",
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
            "The ARN of the topic whose DataProtectionPolicy you want to add or update.",
          type: "string",
          required: true,
        },
        DataProtectionPolicy: {
          name: "Data Protection Policy",
          description:
            "The JSON serialization of the topic's DataProtectionPolicy.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutDataProtectionPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Data Protection Policy Result",
      description: "Result from PutDataProtectionPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putDataProtectionPolicy;
