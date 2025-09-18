import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteHsmConfigurationCommand,
} from "@aws-sdk/client-redshift";

const deleteHsmConfiguration: AppBlock = {
  name: "Delete Hsm Configuration",
  description: `Deletes the specified Amazon Redshift HSM configuration.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HsmConfigurationIdentifier: {
          name: "Hsm Configuration Identifier",
          description:
            "The identifier of the Amazon Redshift HSM configuration to be deleted.",
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

        const command = new DeleteHsmConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Hsm Configuration Result",
      description: "Result from DeleteHsmConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteHsmConfiguration;
