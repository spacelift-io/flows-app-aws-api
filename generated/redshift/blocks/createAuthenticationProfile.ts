import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateAuthenticationProfileCommand,
} from "@aws-sdk/client-redshift";

const createAuthenticationProfile: AppBlock = {
  name: "Create Authentication Profile",
  description: `Creates an authentication profile with the specified parameters.`,
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
          description: "The name of the authentication profile to be created.",
          type: "string",
          required: true,
        },
        AuthenticationProfileContent: {
          name: "Authentication Profile Content",
          description:
            "The content of the authentication profile in JSON format.",
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

        const command = new CreateAuthenticationProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Authentication Profile Result",
      description: "Result from CreateAuthenticationProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AuthenticationProfileName: {
            type: "string",
            description:
              "The name of the authentication profile that was created.",
          },
          AuthenticationProfileContent: {
            type: "string",
            description:
              "The content of the authentication profile in JSON format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createAuthenticationProfile;
