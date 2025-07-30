import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetRoleCommand } from "@aws-sdk/client-iam";

const getRole: AppBlock = {
  name: "Get Role",
  description:
    "Retrieves information about the specified role, including the role's path, GUID, ARN, and the role's trust policy that grants permission to assume the role.",
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
          description: "The name of the IAM role to get information about.",
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
        });

        const command = new GetRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Role Result",
      description: "Result from GetRole operation",
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
            description: "A structure containing details about the IAM role.",
          },
        },
        required: ["Role"],
      },
    },
  },
};

export default getRole;
