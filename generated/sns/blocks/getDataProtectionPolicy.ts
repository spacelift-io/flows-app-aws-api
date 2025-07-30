import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, GetDataProtectionPolicyCommand } from "@aws-sdk/client-sns";

const getDataProtectionPolicy: AppBlock = {
  name: "Get Data Protection Policy",
  description:
    "Retrieves the specified inline DataProtectionPolicy document that is stored in the specified Amazon SNS topic.",
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
            "The ARN of the topic whose DataProtectionPolicy you want to get.",
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
        });

        const command = new GetDataProtectionPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Data Protection Policy Result",
      description: "Result from GetDataProtectionPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DataProtectionPolicy: {
            type: "string",
            description:
              "Retrieves the DataProtectionPolicy in JSON string format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDataProtectionPolicy;
