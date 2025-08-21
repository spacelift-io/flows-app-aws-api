import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateInstanceProfileCommand } from "@aws-sdk/client-iam";

const createInstanceProfile: AppBlock = {
  name: "Create Instance Profile",
  description: "Creates a new instance profile.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceProfileName: {
          name: "Instance Profile Name",
          description: "The name of the instance profile to create.",
          type: "string",
          required: true,
        },
        Path: {
          name: "Path",
          description: "The path to the instance profile.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags that you want to attach to the newly created IAM instance profile.",
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

        const command = new CreateInstanceProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Instance Profile Result",
      description: "Result from CreateInstanceProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceProfile: {
            type: "object",
            properties: {
              Path: {
                type: "string",
              },
              InstanceProfileName: {
                type: "string",
              },
              InstanceProfileId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              Roles: {
                type: "array",
                items: {
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
                          type: "object",
                          additionalProperties: true,
                        },
                        PermissionsBoundaryArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    RoleLastUsed: {
                      type: "object",
                      properties: {
                        LastUsedDate: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Region: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["Path", "RoleName", "RoleId", "Arn", "CreateDate"],
                  additionalProperties: false,
                },
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
            },
            required: [
              "Path",
              "InstanceProfileName",
              "InstanceProfileId",
              "Arn",
              "CreateDate",
              "Roles",
            ],
            additionalProperties: false,
            description:
              "A structure containing details about the new instance profile.",
          },
        },
        required: ["InstanceProfile"],
      },
    },
  },
};

export default createInstanceProfile;
