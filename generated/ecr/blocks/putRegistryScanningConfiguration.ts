import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  PutRegistryScanningConfigurationCommand,
} from "@aws-sdk/client-ecr";

const putRegistryScanningConfiguration: AppBlock = {
  name: "Put Registry Scanning Configuration",
  description:
    "Creates or updates the scanning configuration for your private registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        scanType: {
          name: "scan Type",
          description: "The scanning type to set for the registry.",
          type: "string",
          required: false,
        },
        rules: {
          name: "rules",
          description: "The scanning rules to use for the registry.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                scanFrequency: {
                  type: "string",
                },
                repositoryFilters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      filter: {
                        type: "object",
                        additionalProperties: true,
                      },
                      filterType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["filter", "filterType"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["scanFrequency", "repositoryFilters"],
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECRClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutRegistryScanningConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Registry Scanning Configuration Result",
      description: "Result from PutRegistryScanningConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryScanningConfiguration: {
            type: "object",
            properties: {
              scanType: {
                type: "string",
              },
              rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    scanFrequency: {
                      type: "string",
                    },
                    repositoryFilters: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["scanFrequency", "repositoryFilters"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "The scanning configuration for your registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putRegistryScanningConfiguration;
