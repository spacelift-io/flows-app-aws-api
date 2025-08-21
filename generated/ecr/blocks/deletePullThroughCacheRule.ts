import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DeletePullThroughCacheRuleCommand,
} from "@aws-sdk/client-ecr";

const deletePullThroughCacheRule: AppBlock = {
  name: "Delete Pull Through Cache Rule",
  description: "Deletes a pull through cache rule.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ecrRepositoryPrefix: {
          name: "ecr Repository Prefix",
          description:
            "The Amazon ECR repository prefix associated with the pull through cache rule to delete.",
          type: "string",
          required: true,
        },
        registryId: {
          name: "registry Id",
          description:
            "The Amazon Web Services account ID associated with the registry that contains the pull through cache rule.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeletePullThroughCacheRuleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Pull Through Cache Rule Result",
      description: "Result from DeletePullThroughCacheRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ecrRepositoryPrefix: {
            type: "string",
            description:
              "The Amazon ECR repository prefix associated with the request.",
          },
          upstreamRegistryUrl: {
            type: "string",
            description:
              "The upstream registry URL associated with the pull through cache rule.",
          },
          createdAt: {
            type: "string",
            description:
              "The timestamp associated with the pull through cache rule.",
          },
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          credentialArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret associated with the pull through cache rule.",
          },
          customRoleArn: {
            type: "string",
            description:
              "The ARN of the IAM role associated with the pull through cache rule.",
          },
          upstreamRepositoryPrefix: {
            type: "string",
            description:
              "The upstream repository prefix associated with the pull through cache rule.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deletePullThroughCacheRule;
