import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateUserCommand } from "@aws-sdk/client-iam";

const createUser: AppBlock = {
  name: "Create User",
  description: "Creates a new IAM user for your Amazon Web Services account.",
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
          description: "The path for the user name.",
          type: "string",
          required: false,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user to create.",
          type: "string",
          required: true,
        },
        PermissionsBoundary: {
          name: "Permissions Boundary",
          description:
            "The ARN of the managed policy that is used to set the permissions boundary for the user.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags that you want to attach to the new user.",
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
        });

        const command = new CreateUserCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create User Result",
      description: "Result from CreateUser operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          User: {
            type: "object",
            properties: {
              Path: {
                type: "string",
              },
              UserName: {
                type: "string",
              },
              UserId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              PasswordLastUsed: {
                type: "string",
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
            },
            required: ["Path", "UserName", "UserId", "Arn", "CreateDate"],
            additionalProperties: false,
            description: "A structure with details about the new IAM user.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createUser;
