import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateUsageLimitCommand,
} from "@aws-sdk/client-redshift";

const createUsageLimit: AppBlock = {
  name: "Create Usage Limit",
  description: `Creates a usage limit for a specified Amazon Redshift feature on a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The identifier of the cluster that you want to limit usage.",
          type: "string",
          required: true,
        },
        FeatureType: {
          name: "Feature Type",
          description: "The Amazon Redshift feature that you want to limit.",
          type: "string",
          required: true,
        },
        LimitType: {
          name: "Limit Type",
          description: "The type of limit.",
          type: "string",
          required: true,
        },
        Amount: {
          name: "Amount",
          description: "The limit amount.",
          type: "number",
          required: true,
        },
        Period: {
          name: "Period",
          description: "The time period that the amount applies to.",
          type: "string",
          required: false,
        },
        BreachAction: {
          name: "Breach Action",
          description:
            "The action that Amazon Redshift takes when the limit is reached.",
          type: "string",
          required: false,
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

        const command = new CreateUsageLimitCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Usage Limit Result",
      description: "Result from CreateUsageLimit operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UsageLimitId: {
            type: "string",
            description: "The identifier of the usage limit.",
          },
          ClusterIdentifier: {
            type: "string",
            description: "The identifier of the cluster with a usage limit.",
          },
          FeatureType: {
            type: "string",
            description:
              "The Amazon Redshift feature to which the limit applies.",
          },
          LimitType: {
            type: "string",
            description: "The type of limit.",
          },
          Amount: {
            type: "number",
            description: "The limit amount.",
          },
          Period: {
            type: "string",
            description: "The time period that the amount applies to.",
          },
          BreachAction: {
            type: "string",
            description:
              "The action that Amazon Redshift takes when the limit is reached.",
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
            description: "A list of tag instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createUsageLimit;
