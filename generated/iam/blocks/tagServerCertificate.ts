import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, TagServerCertificateCommand } from "@aws-sdk/client-iam";

const tagServerCertificate: AppBlock = {
  name: "Tag Server Certificate",
  description: "Adds one or more tags to an IAM server certificate.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ServerCertificateName: {
          name: "Server Certificate Name",
          description:
            "The name of the IAM server certificate to which you want to add tags.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of tags that you want to attach to the IAM server certificate.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
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

        const command = new TagServerCertificateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag Server Certificate Result",
      description: "Result from TagServerCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagServerCertificate;
