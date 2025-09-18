import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyAquaConfigurationCommand,
} from "@aws-sdk/client-redshift";

const modifyAquaConfiguration: AppBlock = {
  name: "Modify Aqua Configuration",
  description: `This operation is retired.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description: "The identifier of the cluster to be modified.",
          type: "string",
          required: true,
        },
        AquaConfigurationStatus: {
          name: "Aqua Configuration Status",
          description: "This parameter is retired.",
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

        const command = new ModifyAquaConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Aqua Configuration Result",
      description: "Result from ModifyAquaConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AquaConfiguration: {
            type: "object",
            properties: {
              AquaStatus: {
                type: "string",
              },
              AquaConfigurationStatus: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "This parameter is retired.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyAquaConfiguration;
