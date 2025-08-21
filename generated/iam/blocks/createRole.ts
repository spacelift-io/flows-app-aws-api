import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateRoleCommand } from "@aws-sdk/client-iam";

const createRole: AppBlock = {
  name: "Create Role",
  description: "Creates a new role for your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Path: {
          name: "Path",
          description: "The path to the role.",
          type: "string",
          required: false,
        },
        RoleName: {
          name: "Role Name",
          description: "The name of the role to create.",
          type: "string",
          required: true,
        },
        AssumeRolePolicyDocument: {
          name: "Assume Role Policy Document",
          description:
            "The trust relationship policy document that grants an entity permission to assume the role.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description of the role.",
          type: "string",
          required: false,
        },
        MaxSessionDuration: {
          name: "Max Session Duration",
          description:
            "The maximum session duration (in seconds) that you want to set for the specified role.",
          type: "number",
          required: false,
        },
        PermissionsBoundary: {
          name: "Permissions Boundary",
          description:
            "The ARN of the managed policy that is used to set the permissions boundary for the role.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags that you want to attach to the new role.",
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
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
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

        const command = new CreateRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Role Result",
      description: "Result from CreateRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Role: {
            type: "object",
            properties: {
              Path: {
                type: "string",
              },
              RoleName: {
                type: "string",
              },
              RoleId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              AssumeRolePolicyDocument: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              MaxSessionDuration: {
                type: "number",
              },
              PermissionsBoundary: {
                type: "object",
                properties: {
                  PermissionsBoundaryType: {
                    type: "string",
                  },
                  PermissionsBoundaryArn: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Tags: {
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
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
              RoleLastUsed: {
                type: "object",
                properties: {
                  LastUsedDate: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["Path", "RoleName", "RoleId", "Arn", "CreateDate"],
            additionalProperties: false,
            description: "A structure containing details about the new role.",
          },
        },
        required: ["Role"],
      },
    },
  },
};

export default createRole;
