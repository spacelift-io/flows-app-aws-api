import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetAccessTokenCommand } from "@aws-sdk/client-ssm";

const getAccessToken: AppBlock = {
  name: "Get Access Token",
  description:
    "Returns a credentials set to be used with just-in-time node access.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AccessRequestId: {
          name: "Access Request Id",
          description: "The ID of a just-in-time node access request.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetAccessTokenCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Access Token Result",
      description: "Result from GetAccessToken operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Credentials: {
            type: "object",
            properties: {
              AccessKeyId: {
                type: "string",
              },
              SecretAccessKey: {
                type: "string",
              },
              SessionToken: {
                type: "string",
              },
              ExpirationTime: {
                type: "string",
              },
            },
            required: [
              "AccessKeyId",
              "SecretAccessKey",
              "SessionToken",
              "ExpirationTime",
            ],
            additionalProperties: false,
            description:
              "The temporary security credentials which can be used to start just-in-time node access sessions.",
          },
          AccessRequestStatus: {
            type: "string",
            description: "The status of the access request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccessToken;
