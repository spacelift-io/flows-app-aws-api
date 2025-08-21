import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, GetLifecyclePolicyCommand } from "@aws-sdk/client-ecr";

const getLifecyclePolicy: AppBlock = {
  name: "Get Lifecycle Policy",
  description: "Retrieves the lifecycle policy for the specified repository.",
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
          description: "The name of the repository.",
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

        const command = new GetLifecyclePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Lifecycle Policy Result",
      description: "Result from GetLifecyclePolicy operation",
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
            description: "The JSON lifecycle policy text.",
          },
          lastEvaluatedAt: {
            type: "string",
            description:
              "The time stamp of the last time that the lifecycle policy was run.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getLifecyclePolicy;
