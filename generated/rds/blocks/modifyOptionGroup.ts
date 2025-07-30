import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyOptionGroupCommand } from "@aws-sdk/client-rds";

const modifyOptionGroup: AppBlock = {
  name: "Modify Option Group",
  description: "Modifies an existing option group.",
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
          description: "The name of the option group to be modified.",
          type: "string",
          required: true,
        },
        OptionsToInclude: {
          name: "Options To Include",
          description:
            "Options in this list are added to the option group or, if already present, the specified configuration is used to update the existing configuration.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OptionName: {
                  type: "string",
                },
                Port: {
                  type: "number",
                },
                OptionVersion: {
                  type: "string",
                },
                DBSecurityGroupMemberships: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                VpcSecurityGroupMemberships: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                OptionSettings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DefaultValue: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ApplyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DataType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AllowedValues: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IsModifiable: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IsCollection: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              required: ["OptionName"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        OptionsToRemove: {
          name: "Options To Remove",
          description:
            "Options in this list are removed from the option group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ApplyImmediately: {
          name: "Apply Immediately",
          description:
            "Specifies whether to apply the change immediately or during the next maintenance window for each instance associated with the option group.",
          type: "boolean",
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
        });

        const command = new ModifyOptionGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Option Group Result",
      description: "Result from ModifyOptionGroup operation",
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

export default modifyOptionGroup;
