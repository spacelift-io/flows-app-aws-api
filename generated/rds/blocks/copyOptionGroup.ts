import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CopyOptionGroupCommand } from "@aws-sdk/client-rds";

const copyOptionGroup: AppBlock = {
  name: "Copy Option Group",
  description: "Copies the specified option group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceOptionGroupIdentifier: {
          name: "Source Option Group Identifier",
          description: "The identifier for the source option group.",
          type: "string",
          required: true,
        },
        TargetOptionGroupIdentifier: {
          name: "Target Option Group Identifier",
          description: "The identifier for the copied option group.",
          type: "string",
          required: true,
        },
        TargetOptionGroupDescription: {
          name: "Target Option Group Description",
          description: "The description for the copied option group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags.",
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
        });

        const command = new CopyOptionGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy Option Group Result",
      description: "Result from CopyOptionGroup operation",
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

export default copyOptionGroup;
