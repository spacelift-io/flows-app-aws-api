import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  UpdatePullThroughCacheRuleCommand,
} from "@aws-sdk/client-ecr";

const updatePullThroughCacheRule: AppBlock = {
  name: "Update Pull Through Cache Rule",
  description: "Updates an existing pull through cache rule.",
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
            "The Amazon Web Services account ID associated with the registry associated with the pull through cache rule.",
          type: "string",
          required: false,
        },
        ecrRepositoryPrefix: {
          name: "ecr Repository Prefix",
          description:
            "The repository name prefix to use when caching images from the source registry.",
          type: "string",
          required: true,
        },
        credentialArn: {
          name: "credential Arn",
          description:
            "The Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret that identifies the credentials to authenticate to the upstream registry.",
          type: "string",
          required: false,
        },
        customRoleArn: {
          name: "custom Role Arn",
          description:
            "Amazon Resource Name (ARN) of the IAM role to be assumed by Amazon ECR to authenticate to the ECR upstream registry.",
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
        });

        const command = new UpdatePullThroughCacheRuleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Pull Through Cache Rule Result",
      description: "Result from UpdatePullThroughCacheRule operation",
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
          updatedAt: {
            type: "string",
            description:
              "The date and time, in JavaScript date format, when the pull through cache rule was updated.",
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

export default updatePullThroughCacheRule;
