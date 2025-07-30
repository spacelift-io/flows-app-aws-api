import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetSSHPublicKeyCommand } from "@aws-sdk/client-iam";

const getSSHPublicKey: AppBlock = {
  name: "Get SSH Public Key",
  description:
    "Retrieves the specified SSH public key, including metadata about the key.",
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
        Encoding: {
          name: "Encoding",
          description:
            "Specifies the public key encoding format to use in the response.",
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

        const command = new GetSSHPublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get SSH Public Key Result",
      description: "Result from GetSSHPublicKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SSHPublicKey: {
            type: "object",
            properties: {
              UserName: {
                type: "string",
              },
              SSHPublicKeyId: {
                type: "string",
              },
              Fingerprint: {
                type: "string",
              },
              SSHPublicKeyBody: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              UploadDate: {
                type: "string",
              },
            },
            required: [
              "UserName",
              "SSHPublicKeyId",
              "Fingerprint",
              "SSHPublicKeyBody",
              "Status",
            ],
            additionalProperties: false,
            description:
              "A structure containing details about the SSH public key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSSHPublicKey;
