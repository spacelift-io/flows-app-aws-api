import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetServerCertificateCommand } from "@aws-sdk/client-iam";

const getServerCertificate: AppBlock = {
  name: "Get Server Certificate",
  description:
    "Retrieves information about the specified server certificate stored in IAM.",
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
            "The name of the server certificate you want to retrieve information about.",
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

        const command = new GetServerCertificateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Server Certificate Result",
      description: "Result from GetServerCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServerCertificate: {
            type: "object",
            properties: {
              ServerCertificateMetadata: {
                type: "object",
                properties: {
                  Path: {
                    type: "string",
                  },
                  ServerCertificateName: {
                    type: "string",
                  },
                  ServerCertificateId: {
                    type: "string",
                  },
                  Arn: {
                    type: "string",
                  },
                  UploadDate: {
                    type: "string",
                  },
                  Expiration: {
                    type: "string",
                  },
                },
                required: [
                  "Path",
                  "ServerCertificateName",
                  "ServerCertificateId",
                  "Arn",
                ],
                additionalProperties: false,
              },
              CertificateBody: {
                type: "string",
              },
              CertificateChain: {
                type: "string",
              },
              Tags: {
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
            },
            required: ["ServerCertificateMetadata", "CertificateBody"],
            additionalProperties: false,
            description:
              "A structure containing details about the server certificate.",
          },
        },
        required: ["ServerCertificate"],
      },
    },
  },
};

export default getServerCertificate;
