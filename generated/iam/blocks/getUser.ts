import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetUserCommand } from "@aws-sdk/client-iam";

const getUser: AppBlock = {
  name: "Get User",
  description:
    "Retrieves information about the specified IAM user, including the user's creation date, path, unique ID, and ARN.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user to get information about.",
          type: "string",
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

        const command = new GetUserCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get User Result",
      description: "Result from GetUser operation",
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
            description: "A structure containing details about the IAM user.",
          },
        },
        required: ["User"],
      },
    },
  },
};

export default getUser;
