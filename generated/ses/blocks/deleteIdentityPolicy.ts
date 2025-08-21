import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, DeleteIdentityPolicyCommand } from "@aws-sdk/client-ses";

const deleteIdentityPolicy: AppBlock = {
  name: "Delete Identity Policy",
  description:
    "Deletes the specified sending authorization policy for the given identity (an email address or a domain).",
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
            "The identity that is associated with the policy to delete.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "The name of the policy to be deleted.",
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

        const command = new DeleteIdentityPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Identity Policy Result",
      description: "Result from DeleteIdentityPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteIdentityPolicy;
