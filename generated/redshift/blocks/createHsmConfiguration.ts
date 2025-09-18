import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateHsmConfigurationCommand,
} from "@aws-sdk/client-redshift";

const createHsmConfiguration: AppBlock = {
  name: "Create Hsm Configuration",
  description: `Creates an HSM configuration that contains the information required by an Amazon Redshift cluster to store and use database encryption keys in a Hardware Security Module (HSM).`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HsmConfigurationIdentifier: {
          name: "Hsm Configuration Identifier",
          description:
            "The identifier to be assigned to the new Amazon Redshift HSM configuration.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "A text description of the HSM configuration to be created.",
          type: "string",
          required: true,
        },
        HsmIpAddress: {
          name: "Hsm Ip Address",
          description:
            "The IP address that the Amazon Redshift cluster must use to access the HSM.",
          type: "string",
          required: true,
        },
        HsmPartitionName: {
          name: "Hsm Partition Name",
          description:
            "The name of the partition in the HSM where the Amazon Redshift clusters will store their database encryption keys.",
          type: "string",
          required: true,
        },
        HsmPartitionPassword: {
          name: "Hsm Partition Password",
          description: "The password required to access the HSM partition.",
          type: "string",
          required: true,
        },
        HsmServerPublicCertificate: {
          name: "Hsm Server Public Certificate",
          description: "The HSMs public certificate file.",
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

        const command = new CreateHsmConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Hsm Configuration Result",
      description: "Result from CreateHsmConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HsmConfiguration: {
            type: "object",
            properties: {
              HsmConfigurationIdentifier: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              HsmIpAddress: {
                type: "string",
              },
              HsmPartitionName: {
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
            description:
              "Returns information about an HSM configuration, which is an object that describes to Amazon Redshift clusters the information they require to connect to an HSM where they can store database encryption keys.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createHsmConfiguration;
