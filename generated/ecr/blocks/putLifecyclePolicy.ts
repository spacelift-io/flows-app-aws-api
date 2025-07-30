import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, PutLifecyclePolicyCommand } from "@aws-sdk/client-ecr";

const putLifecyclePolicy: AppBlock = {
  name: "Put Lifecycle Policy",
  description:
    "Creates or updates the lifecycle policy for the specified repository.",
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
        lifecyclePolicyText: {
          name: "lifecycle Policy Text",
          description:
            "The JSON repository policy text to apply to the repository.",
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
        });

        const command = new PutLifecyclePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Lifecycle Policy Result",
      description: "Result from PutLifecyclePolicy operation",
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
          lifecyclePolicyText: {
            type: "string",
            description: "The JSON repository policy text.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putLifecyclePolicy;
