import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteAuthenticationProfileCommand,
} from "@aws-sdk/client-redshift";

const deleteAuthenticationProfile: AppBlock = {
  name: "Delete Authentication Profile",
  description: `Deletes an authentication profile.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AuthenticationProfileName: {
          name: "Authentication Profile Name",
          description: "The name of the authentication profile to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteAuthenticationProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Authentication Profile Result",
      description: "Result from DeleteAuthenticationProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AuthenticationProfileName: {
            type: "string",
            description:
              "The name of the authentication profile that was deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteAuthenticationProfile;
