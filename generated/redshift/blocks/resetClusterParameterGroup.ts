import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ResetClusterParameterGroupCommand,
} from "@aws-sdk/client-redshift";

const resetClusterParameterGroup: AppBlock = {
  name: "Reset Cluster Parameter Group",
  description: `Sets one or more parameters of the specified parameter group to their default values and sets the source values of the parameters to "engine-default".`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ParameterGroupName: {
          name: "Parameter Group Name",
          description: "The name of the cluster parameter group to be reset.",
          type: "string",
          required: true,
        },
        ResetAllParameters: {
          name: "Reset All Parameters",
          description:
            "If true, all parameters in the specified parameter group will be reset to their default values.",
          type: "boolean",
          required: false,
        },
        Parameters: {
          name: "Parameters",
          description: "An array of names of parameters to be reset.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ParameterName: {
                  type: "string",
                },
                ParameterValue: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                DataType: {
                  type: "string",
                },
                AllowedValues: {
                  type: "string",
                },
                ApplyType: {
                  type: "string",
                },
                IsModifiable: {
                  type: "boolean",
                },
                MinimumEngineVersion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
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

        const command = new ResetClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Cluster Parameter Group Result",
      description: "Result from ResetClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ParameterGroupName: {
            type: "string",
            description: "The name of the cluster parameter group.",
          },
          ParameterGroupStatus: {
            type: "string",
            description: "The status of the parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resetClusterParameterGroup;
