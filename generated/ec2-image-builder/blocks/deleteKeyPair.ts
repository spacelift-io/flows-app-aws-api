import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteKeyPairCommand } from "@aws-sdk/client-ec2";

const deleteKeyPair: AppBlock = {
  name: "Delete Key Pair",
  description:
    "Deletes the specified key pair, by removing the public key from Amazon EC2.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyName: {
          name: "Key Name",
          description: "The name of the key pair.",
          type: "string",
          required: false,
        },
        KeyPairId: {
          name: "Key Pair Id",
          description: "The ID of the key pair.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteKeyPairCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Key Pair Result",
      description: "Result from DeleteKeyPair operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Is true if the request succeeds, and an error otherwise.",
          },
          KeyPairId: {
            type: "string",
            description: "The ID of the key pair.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteKeyPair;
