import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UploadSSHPublicKeyCommand } from "@aws-sdk/client-iam";

const uploadSSHPublicKey: AppBlock = {
  name: "Upload SSH Public Key",
  description:
    "Uploads an SSH public key and associates it with the specified IAM user.",
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
            "The name of the IAM user to associate the SSH public key with.",
          type: "string",
          required: true,
        },
        SSHPublicKeyBody: {
          name: "SSH Public Key Body",
          description: "The SSH public key.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UploadSSHPublicKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Upload SSH Public Key Result",
      description: "Result from UploadSSHPublicKey operation",
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
            description: "Contains information about the SSH public key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default uploadSSHPublicKey;
