import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  ValidatePullThroughCacheRuleCommand,
} from "@aws-sdk/client-ecr";

const validatePullThroughCacheRule: AppBlock = {
  name: "Validate Pull Through Cache Rule",
  description:
    "Validates an existing pull through cache rule for an upstream registry that requires authentication.",
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
            "The repository name prefix associated with the pull through cache rule.",
          type: "string",
          required: true,
        },
        registryId: {
          name: "registry Id",
          description:
            "The registry ID associated with the pull through cache rule.",
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

        const command = new ValidatePullThroughCacheRuleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Validate Pull Through Cache Rule Result",
      description: "Result from ValidatePullThroughCacheRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ecrRepositoryPrefix: {
            type: "string",
            description:
              "The Amazon ECR repository prefix associated with the pull through cache rule.",
          },
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          upstreamRegistryUrl: {
            type: "string",
            description:
              "The upstream registry URL associated with the pull through cache rule.",
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
          isValid: {
            type: "boolean",
            description:
              "Whether or not the pull through cache rule was validated.",
          },
          failure: {
            type: "string",
            description: "The reason the validation failed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default validatePullThroughCacheRule;
