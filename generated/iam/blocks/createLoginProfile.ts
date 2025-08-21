import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateLoginProfileCommand } from "@aws-sdk/client-iam";

const createLoginProfile: AppBlock = {
  name: "Create Login Profile",
  description: "Creates a password for the specified IAM user.",
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
          description: "The name of the IAM user to create a password for.",
          type: "string",
          required: false,
        },
        Password: {
          name: "Password",
          description: "The new password for the user.",
          type: "string",
          required: false,
        },
        PasswordResetRequired: {
          name: "Password Reset Required",
          description:
            "Specifies whether the user is required to set a new password on next sign-in.",
          type: "boolean",
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

        const command = new CreateLoginProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Login Profile Result",
      description: "Result from CreateLoginProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LoginProfile: {
            type: "object",
            properties: {
              UserName: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              PasswordResetRequired: {
                type: "boolean",
              },
            },
            required: ["UserName", "CreateDate"],
            additionalProperties: false,
            description:
              "A structure containing the user name and password create date.",
          },
        },
        required: ["LoginProfile"],
      },
    },
  },
};

export default createLoginProfile;
