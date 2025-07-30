import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteSSHPublicKeyCommand } from "@aws-sdk/client-iam";

const deleteSSHPublicKey: AppBlock = {
  name: "Delete SSH Public Key",
  description: "Deletes the specified SSH public key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name of the IAM user associated with the SSH public key.",
          type: "string",
          required: true,
        },
        SSHPublicKeyId: {
          name: "SSH Public Key Id",
          description: "The unique identifier for the SSH public key.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteSSHPublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete SSH Public Key Result",
      description: "Result from DeleteSSHPublicKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSSHPublicKey;
