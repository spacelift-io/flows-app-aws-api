import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBParameterGroupCommand } from "@aws-sdk/client-rds";

const modifyDBParameterGroup: AppBlock = {
  name: "Modify DB Parameter Group",
  description: "Modifies the parameters of a DB parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBParameterGroupName: {
          name: "DB Parameter Group Name",
          description: "The name of the DB parameter group.",
          type: "string",
          required: true,
        },
        Parameters: {
          name: "Parameters",
          description:
            "An array of parameter names, values, and the application methods for the parameter update.",
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

        const command = new ModifyDBParameterGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Parameter Group Result",
      description: "Result from ModifyDBParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBParameterGroupName: {
            type: "string",
            description: "The name of the DB parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBParameterGroup;
