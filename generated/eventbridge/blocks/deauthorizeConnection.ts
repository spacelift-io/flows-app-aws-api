import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DeauthorizeConnectionCommand,
} from "@aws-sdk/client-eventbridge";

const deauthorizeConnection: AppBlock = {
  name: "Deauthorize Connection",
  description: "Removes all authorization parameters from the connection.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "The name of the connection to remove authorization from.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeauthorizeConnectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deauthorize Connection Result",
      description: "Result from DeauthorizeConnection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConnectionArn: {
            type: "string",
            description:
              "The ARN of the connection that authorization was removed from.",
          },
          ConnectionState: {
            type: "string",
            description: "The state of the connection.",
          },
          CreationTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was created.",
          },
          LastModifiedTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was last updated.",
          },
          LastAuthorizedTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was last authorized.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deauthorizeConnection;
