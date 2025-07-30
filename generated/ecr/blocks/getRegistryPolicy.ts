import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, GetRegistryPolicyCommand } from "@aws-sdk/client-ecr";

const getRegistryPolicy: AppBlock = {
  name: "Get Registry Policy",
  description: "Retrieves the permissions policy for a registry.",
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

        const command = new GetRegistryPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Registry Policy Result",
      description: "Result from GetRegistryPolicy operation",
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
              "The JSON text of the permissions policy for a registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRegistryPolicy;
