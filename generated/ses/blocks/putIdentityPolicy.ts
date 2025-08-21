import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, PutIdentityPolicyCommand } from "@aws-sdk/client-ses";

const putIdentityPolicy: AppBlock = {
  name: "Put Identity Policy",
  description:
    "Adds or updates a sending authorization policy for the specified identity (an email address or a domain).",
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
          description: "The identity to which that the policy applies.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "The name of the policy.",
          type: "string",
          required: true,
        },
        Policy: {
          name: "Policy",
          description: "The text of the policy in JSON format.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutIdentityPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Identity Policy Result",
      description: "Result from PutIdentityPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putIdentityPolicy;
