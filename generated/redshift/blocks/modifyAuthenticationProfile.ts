import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyAuthenticationProfileCommand,
} from "@aws-sdk/client-redshift";

const modifyAuthenticationProfile: AppBlock = {
  name: "Modify Authentication Profile",
  description: `Modifies an authentication profile.`,
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
          description: "The name of the authentication profile to replace.",
          type: "string",
          required: true,
        },
        AuthenticationProfileContent: {
          name: "Authentication Profile Content",
          description:
            "The new content of the authentication profile in JSON format.",
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

        const command = new ModifyAuthenticationProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Authentication Profile Result",
      description: "Result from ModifyAuthenticationProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AuthenticationProfileName: {
            type: "string",
            description:
              "The name of the authentication profile that was replaced.",
          },
          AuthenticationProfileContent: {
            type: "string",
            description:
              "The updated content of the authentication profile in JSON format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyAuthenticationProfile;
