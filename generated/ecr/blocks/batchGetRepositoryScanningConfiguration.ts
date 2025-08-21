import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  BatchGetRepositoryScanningConfigurationCommand,
} from "@aws-sdk/client-ecr";

const batchGetRepositoryScanningConfiguration: AppBlock = {
  name: "Batch Get Repository Scanning Configuration",
  description: "Gets the scanning configuration for one or more repositories.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        repositoryNames: {
          name: "repository Names",
          description:
            "One or more repository names to get the scanning configuration for.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new BatchGetRepositoryScanningConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Get Repository Scanning Configuration Result",
      description:
        "Result from BatchGetRepositoryScanningConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          scanningConfigurations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                repositoryArn: {
                  type: "string",
                },
                repositoryName: {
                  type: "string",
                },
                scanOnPush: {
                  type: "boolean",
                },
                scanFrequency: {
                  type: "string",
                },
                appliedScanFilters: {
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
              additionalProperties: false,
            },
            description:
              "The scanning configuration for the requested repositories.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                repositoryName: {
                  type: "string",
                },
                failureCode: {
                  type: "string",
                },
                failureReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any failures associated with the call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchGetRepositoryScanningConfiguration;
