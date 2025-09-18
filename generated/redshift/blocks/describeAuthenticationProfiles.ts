import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeAuthenticationProfilesCommand,
} from "@aws-sdk/client-redshift";

const describeAuthenticationProfiles: AppBlock = {
  name: "Describe Authentication Profiles",
  description: `Describes an authentication profile.`,
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
          description: "The name of the authentication profile to describe.",
          type: "string",
          required: false,
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

        const command = new DescribeAuthenticationProfilesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Authentication Profiles Result",
      description: "Result from DescribeAuthenticationProfiles operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AuthenticationProfiles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AuthenticationProfileName: {
                  type: "string",
                },
                AuthenticationProfileContent: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of authentication profiles.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAuthenticationProfiles;
