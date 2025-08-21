import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, DescribeRegistryCommand } from "@aws-sdk/client-ecr";

const describeRegistry: AppBlock = {
  name: "Describe Registry",
  description: "Describes the settings for a registry.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeRegistryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Registry Result",
      description: "Result from DescribeRegistry operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
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
            description: "The replication configuration for the registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRegistry;
