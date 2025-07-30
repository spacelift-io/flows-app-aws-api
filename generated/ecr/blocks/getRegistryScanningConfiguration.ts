import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  GetRegistryScanningConfigurationCommand,
} from "@aws-sdk/client-ecr";

const getRegistryScanningConfiguration: AppBlock = {
  name: "Get Registry Scanning Configuration",
  description: "Retrieves the scanning configuration for a registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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

        const command = new GetRegistryScanningConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Registry Scanning Configuration Result",
      description: "Result from GetRegistryScanningConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          scanningConfiguration: {
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
            description: "The scanning configuration for the registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRegistryScanningConfiguration;
