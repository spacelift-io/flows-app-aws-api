import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  SetSecurityTokenServicePreferencesCommand,
} from "@aws-sdk/client-iam";

const setSecurityTokenServicePreferences: AppBlock = {
  name: "Set Security Token Service Preferences",
  description:
    "Sets the specified version of the global endpoint token as the token version used for the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GlobalEndpointTokenVersion: {
          name: "Global Endpoint Token Version",
          description: "The version of the global endpoint token.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new SetSecurityTokenServicePreferencesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Security Token Service Preferences Result",
      description: "Result from SetSecurityTokenServicePreferences operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setSecurityTokenServicePreferences;
