import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyClusterParameterGroupCommand,
} from "@aws-sdk/client-redshift";

const modifyClusterParameterGroup: AppBlock = {
  name: "Modify Cluster Parameter Group",
  description: `Modifies the parameters of a parameter group.`,
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
          description: "The name of the parameter group to be modified.",
          type: "string",
          required: true,
        },
        Parameters: {
          name: "Parameters",
          description: "An array of parameters to be modified.",
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

        const command = new ModifyClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Cluster Parameter Group Result",
      description: "Result from ModifyClusterParameterGroup operation",
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

export default modifyClusterParameterGroup;
