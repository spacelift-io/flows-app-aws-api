import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateRoleDescriptionCommand } from "@aws-sdk/client-iam";

const updateRoleDescription: AppBlock = {
  name: "Update Role Description",
  description: "Use UpdateRole instead.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description: "The name of the role that you want to modify.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "The new description that you want to apply to the specified role.",
          type: "string",
          required: true,
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

        const command = new UpdateRoleDescriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Role Description Result",
      description: "Result from UpdateRoleDescription operation",
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
            description:
              "A structure that contains details about the modified role.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateRoleDescription;
