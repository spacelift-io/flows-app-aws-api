import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetAccessKeyLastUsedCommand } from "@aws-sdk/client-iam";

const getAccessKeyLastUsed: AppBlock = {
  name: "Get Access Key Last Used",
  description:
    "Retrieves information about when the specified access key was last used.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AccessKeyId: {
          name: "Access Key Id",
          description: "The identifier of an access key.",
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

        const command = new GetAccessKeyLastUsedCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Access Key Last Used Result",
      description: "Result from GetAccessKeyLastUsed operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UserName: {
            type: "string",
            description: "The name of the IAM user that owns this access key.",
          },
          AccessKeyLastUsed: {
            type: "object",
            properties: {
              LastUsedDate: {
                type: "string",
              },
              ServiceName: {
                type: "string",
              },
              Region: {
                type: "string",
              },
            },
            required: ["ServiceName", "Region"],
            additionalProperties: false,
            description:
              "Contains information about the last time the access key was used.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccessKeyLastUsed;
