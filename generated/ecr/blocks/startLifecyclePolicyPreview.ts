import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  StartLifecyclePolicyPreviewCommand,
} from "@aws-sdk/client-ecr";

const startLifecyclePolicyPreview: AppBlock = {
  name: "Start Lifecycle Policy Preview",
  description:
    "Starts a preview of a lifecycle policy for the specified repository.",
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
          description: "The name of the repository to be evaluated.",
          type: "string",
          required: true,
        },
        lifecyclePolicyText: {
          name: "lifecycle Policy Text",
          description: "The policy to be evaluated against.",
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

        const command = new StartLifecyclePolicyPreviewCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Lifecycle Policy Preview Result",
      description: "Result from StartLifecyclePolicyPreview operation",
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
          status: {
            type: "string",
            description: "The status of the lifecycle policy preview request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startLifecyclePolicyPreview;
