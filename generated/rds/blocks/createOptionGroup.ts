import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateOptionGroupCommand } from "@aws-sdk/client-rds";

const createOptionGroup: AppBlock = {
  name: "Create Option Group",
  description: "Creates a new option group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OptionGroupName: {
          name: "Option Group Name",
          description: "Specifies the name of the option group to be created.",
          type: "string",
          required: true,
        },
        EngineName: {
          name: "Engine Name",
          description:
            "The name of the engine to associate this option group with.",
          type: "string",
          required: true,
        },
        MajorEngineVersion: {
          name: "Major Engine Version",
          description:
            "Specifies the major version of the engine that this option group should be associated with.",
          type: "string",
          required: true,
        },
        OptionGroupDescription: {
          name: "Option Group Description",
          description: "The description of the option group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the option group.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
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

        const command = new CreateOptionGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Option Group Result",
      description: "Result from CreateOptionGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OptionGroup: {
            type: "object",
            properties: {
              OptionGroupName: {
                type: "string",
              },
              OptionGroupDescription: {
                type: "string",
              },
              EngineName: {
                type: "string",
              },
              MajorEngineVersion: {
                type: "string",
              },
              Options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    OptionName: {
                      type: "string",
                    },
                    OptionDescription: {
                      type: "string",
                    },
                    Persistent: {
                      type: "boolean",
                    },
                    Permanent: {
                      type: "boolean",
                    },
                    Port: {
                      type: "number",
                    },
                    OptionVersion: {
                      type: "string",
                    },
                    OptionSettings: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    DBSecurityGroupMemberships: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    VpcSecurityGroupMemberships: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              AllowsVpcAndNonVpcInstanceMemberships: {
                type: "boolean",
              },
              VpcId: {
                type: "string",
              },
              OptionGroupArn: {
                type: "string",
              },
              SourceOptionGroup: {
                type: "string",
              },
              SourceAccountId: {
                type: "string",
              },
              CopyTimestamp: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createOptionGroup;
