import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateAccessKeyCommand } from "@aws-sdk/client-iam";

const createAccessKey: AppBlock = {
  name: "Create Access Key",
  description:
    "Creates a new Amazon Web Services secret access key and corresponding Amazon Web Services access key ID for the specified user.",
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
            "The name of the IAM user that the new key will belong to.",
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

        const command = new CreateAccessKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Access Key Result",
      description: "Result from CreateAccessKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccessKey: {
            type: "object",
            properties: {
              UserName: {
                type: "string",
              },
              AccessKeyId: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SecretAccessKey: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
            },
            required: ["UserName", "AccessKeyId", "Status", "SecretAccessKey"],
            additionalProperties: false,
            description: "A structure with details about the access key.",
          },
        },
        required: ["AccessKey"],
      },
    },
  },
};

export default createAccessKey;
