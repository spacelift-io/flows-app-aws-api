import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DescribePullThroughCacheRulesCommand,
} from "@aws-sdk/client-ecr";

const describePullThroughCacheRules: AppBlock = {
  name: "Describe Pull Through Cache Rules",
  description: "Returns the pull through cache rules for a registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        registryId: {
          name: "registry Id",
          description:
            "The Amazon Web Services account ID associated with the registry to return the pull through cache rules for.",
          type: "string",
          required: false,
        },
        ecrRepositoryPrefixes: {
          name: "ecr Repository Prefixes",
          description:
            "The Amazon ECR repository prefixes associated with the pull through cache rules to return.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated DescribePullThroughCacheRulesRequest request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of pull through cache rules returned by DescribePullThroughCacheRulesRequest in paginated output.",
          type: "number",
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

        const command = new DescribePullThroughCacheRulesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Pull Through Cache Rules Result",
      description: "Result from DescribePullThroughCacheRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          pullThroughCacheRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ecrRepositoryPrefix: {
                  type: "string",
                },
                upstreamRegistryUrl: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                },
                registryId: {
                  type: "string",
                },
                credentialArn: {
                  type: "string",
                },
                customRoleArn: {
                  type: "string",
                },
                upstreamRepositoryPrefix: {
                  type: "string",
                },
                upstreamRegistry: {
                  type: "string",
                },
                updatedAt: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The details of the pull through cache rules.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribePullThroughCacheRulesRequest request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePullThroughCacheRules;
