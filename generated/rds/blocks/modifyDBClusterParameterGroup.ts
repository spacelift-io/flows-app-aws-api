import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  ModifyDBClusterParameterGroupCommand,
} from "@aws-sdk/client-rds";

const modifyDBClusterParameterGroup: AppBlock = {
  name: "Modify DB Cluster Parameter Group",
  description: "Modifies the parameters of a DB cluster parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterParameterGroupName: {
          name: "DB Cluster Parameter Group Name",
          description: "The name of the DB cluster parameter group to modify.",
          type: "string",
          required: true,
        },
        Parameters: {
          name: "Parameters",
          description:
            "A list of parameters in the DB cluster parameter group to modify.",
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
                ApplyType: {
                  type: "string",
                },
                DataType: {
                  type: "string",
                },
                AllowedValues: {
                  type: "string",
                },
                IsModifiable: {
                  type: "boolean",
                },
                MinimumEngineVersion: {
                  type: "string",
                },
                ApplyMethod: {
                  type: "string",
                },
                SupportedEngineModes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
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

        const client = new RDSClient({
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

        const command = new ModifyDBClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Cluster Parameter Group Result",
      description: "Result from ModifyDBClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterParameterGroupName: {
            type: "string",
            description: "The name of the DB cluster parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBClusterParameterGroup;
