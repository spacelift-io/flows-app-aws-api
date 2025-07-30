import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, DeleteRegistryPolicyCommand } from "@aws-sdk/client-ecr";

const deleteRegistryPolicy: AppBlock = {
  name: "Delete Registry Policy",
  description: "Deletes the registry permissions policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new DeleteRegistryPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Registry Policy Result",
      description: "Result from DeleteRegistryPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          policyText: {
            type: "string",
            description:
              "The contents of the registry permissions policy that was deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteRegistryPolicy;
