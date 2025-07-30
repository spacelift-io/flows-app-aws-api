import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DeleteConnectionCommand,
} from "@aws-sdk/client-eventbridge";

const deleteConnection: AppBlock = {
  name: "Delete Connection",
  description: "Deletes a connection.",
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
          description: "The name of the connection to delete.",
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

        const command = new DeleteConnectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Connection Result",
      description: "Result from DeleteConnection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConnectionArn: {
            type: "string",
            description: "The ARN of the connection that was deleted.",
          },
          ConnectionState: {
            type: "string",
            description: "The state of the connection before it was deleted.",
          },
          CreationTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was created.",
          },
          LastModifiedTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was last modified before it was deleted.",
          },
          LastAuthorizedTime: {
            type: "string",
            description:
              "A time stamp for the time that the connection was last authorized before it wa deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteConnection;
