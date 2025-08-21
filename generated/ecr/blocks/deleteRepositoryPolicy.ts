import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, DeleteRepositoryPolicyCommand } from "@aws-sdk/client-ecr";

const deleteRepositoryPolicy: AppBlock = {
  name: "Delete Repository Policy",
  description:
    "Deletes the repository policy associated with the specified repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository policy to delete.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository that is associated with the repository policy to delete.",
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

        const command = new DeleteRepositoryPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Repository Policy Result",
      description: "Result from DeleteRepositoryPolicy operation",
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
              "The JSON repository policy that was deleted from the repository.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteRepositoryPolicy;
