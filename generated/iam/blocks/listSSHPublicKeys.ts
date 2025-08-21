import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListSSHPublicKeysCommand } from "@aws-sdk/client-iam";

const listSSHPublicKeys: AppBlock = {
  name: "List SSH Public Keys",
  description:
    "Returns information about the SSH public keys associated with the specified IAM user.",
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
          description: "The name of the IAM user to list SSH public keys for.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "Use this only when paginating results to indicate the maximum number of items you want in the response.",
          type: "number",
          required: false,
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

        const command = new ListSSHPublicKeysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List SSH Public Keys Result",
      description: "Result from ListSSHPublicKeys operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SSHPublicKeys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UserName: {
                  type: "string",
                },
                SSHPublicKeyId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                UploadDate: {
                  type: "string",
                },
              },
              required: ["UserName", "SSHPublicKeyId", "Status", "UploadDate"],
              additionalProperties: false,
            },
            description: "A list of the SSH public keys assigned to IAM user.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items to return.",
          },
          Marker: {
            type: "string",
            description:
              "When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSSHPublicKeys;
