import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, GetIdentityPoliciesCommand } from "@aws-sdk/client-ses";

const getIdentityPolicies: AppBlock = {
  name: "Get Identity Policies",
  description:
    "Returns the requested sending authorization policies for the given identity (an email address or a domain).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identity: {
          name: "Identity",
          description: "The identity for which the policies are retrieved.",
          type: "string",
          required: true,
        },
        PolicyNames: {
          name: "Policy Names",
          description: "A list of the names of policies to be retrieved.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetIdentityPoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Identity Policies Result",
      description: "Result from GetIdentityPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policies: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "A map of policy names to policies.",
          },
        },
        required: ["Policies"],
      },
    },
  },
};

export default getIdentityPolicies;
