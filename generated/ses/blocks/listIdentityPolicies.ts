import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListIdentityPoliciesCommand } from "@aws-sdk/client-ses";

const listIdentityPolicies: AppBlock = {
  name: "List Identity Policies",
  description:
    "Returns a list of sending authorization policies that are attached to the given identity (an email address or a domain).",
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
          description:
            "The identity that is associated with the policy for which the policies are listed.",
          type: "string",
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

        const command = new ListIdentityPoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Identity Policies Result",
      description: "Result from ListIdentityPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PolicyNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of names of policies that apply to the specified identity.",
          },
        },
        required: ["PolicyNames"],
      },
    },
  },
};

export default listIdentityPolicies;
