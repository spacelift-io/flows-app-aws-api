import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GetKeyPolicyCommand } from "@aws-sdk/client-kms";

const getKeyPolicy: AppBlock = {
  name: "Get Key Policy",
  description: "Gets a key policy attached to the specified KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "Gets the key policy for the specified KMS key.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "Specifies the name of the key policy.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
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

        const command = new GetKeyPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Key Policy Result",
      description: "Result from GetKeyPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "string",
            description: "A key policy document in JSON format.",
          },
          PolicyName: {
            type: "string",
            description: "The name of the key policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getKeyPolicy;
