import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, SetRepositoryPolicyCommand } from "@aws-sdk/client-ecr";

const setRepositoryPolicy: AppBlock = {
  name: "Set Repository Policy",
  description:
    "Applies a repository policy to the specified repository to control access permissions.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The name of the repository to receive the policy.",
          type: "string",
          required: true,
        },
        policyText: {
          name: "policy Text",
          description:
            "The JSON repository policy text to apply to the repository.",
          type: "string",
          required: true,
        },
        force: {
          name: "force",
          description:
            "If the policy you are attempting to set on a repository policy would prevent you from setting another policy in the future, you must force the SetRepositoryPolicy operation.",
          type: "boolean",
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

        const command = new SetRepositoryPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Repository Policy Result",
      description: "Result from SetRepositoryPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          repositoryName: {
            type: "string",
            description: "The repository name associated with the request.",
          },
          policyText: {
            type: "string",
            description:
              "The JSON repository policy text applied to the repository.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default setRepositoryPolicy;
