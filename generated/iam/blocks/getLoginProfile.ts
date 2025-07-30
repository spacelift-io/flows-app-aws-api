import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetLoginProfileCommand } from "@aws-sdk/client-iam";

const getLoginProfile: AppBlock = {
  name: "Get Login Profile",
  description: "Retrieves the user name for the specified IAM user.",
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
          description:
            "The name of the user whose login profile you want to retrieve.",
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
        });

        const command = new GetLoginProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Login Profile Result",
      description: "Result from GetLoginProfile operation",
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
              "A structure containing the user name and the profile creation date for the user.",
          },
        },
        required: ["LoginProfile"],
      },
    },
  },
};

export default getLoginProfile;
