import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  PutReplicationConfigurationCommand,
} from "@aws-sdk/client-ecr";

const putReplicationConfiguration: AppBlock = {
  name: "Put Replication Configuration",
  description:
    "Creates or updates the replication configuration for a registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        replicationConfiguration: {
          name: "replication Configuration",
          description:
            "An object representing the replication configuration for a registry.",
          type: {
            type: "object",
            properties: {
              rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    destinations: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    repositoryFilters: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["destinations"],
                  additionalProperties: false,
                },
              },
            },
            required: ["rules"],
            additionalProperties: false,
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

        const command = new PutReplicationConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Replication Configuration Result",
      description: "Result from PutReplicationConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          replicationConfiguration: {
            type: "object",
            properties: {
              rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    destinations: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    repositoryFilters: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["destinations"],
                  additionalProperties: false,
                },
              },
            },
            required: ["rules"],
            additionalProperties: false,
            description:
              "The contents of the replication configuration for the registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putReplicationConfiguration;
