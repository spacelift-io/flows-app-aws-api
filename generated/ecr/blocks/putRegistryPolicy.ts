import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, PutRegistryPolicyCommand } from "@aws-sdk/client-ecr";

const putRegistryPolicy: AppBlock = {
  name: "Put Registry Policy",
  description: "Creates or updates the permissions policy for your registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        policyText: {
          name: "policy Text",
          description: "The JSON policy text to apply to your registry.",
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

        const command = new PutRegistryPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Registry Policy Result",
      description: "Result from PutRegistryPolicy operation",
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
            description: "The JSON policy text for your registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putRegistryPolicy;
