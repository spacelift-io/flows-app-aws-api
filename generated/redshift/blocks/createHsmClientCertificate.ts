import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateHsmClientCertificateCommand,
} from "@aws-sdk/client-redshift";

const createHsmClientCertificate: AppBlock = {
  name: "Create Hsm Client Certificate",
  description: `Creates an HSM client certificate that an Amazon Redshift cluster will use to connect to the client's HSM in order to store and retrieve the keys used to encrypt the cluster databases.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HsmClientCertificateIdentifier: {
          name: "Hsm Client Certificate Identifier",
          description:
            "The identifier to be assigned to the new HSM client certificate that the cluster will use to connect to the HSM to use the database encryption keys.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "A list of tag instances.",
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
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new CreateHsmClientCertificateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Hsm Client Certificate Result",
      description: "Result from CreateHsmClientCertificate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HsmClientCertificate: {
            type: "object",
            properties: {
              HsmClientCertificateIdentifier: {
                type: "string",
              },
              HsmClientCertificatePublicKey: {
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
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Returns information about an HSM client certificate.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createHsmClientCertificate;
