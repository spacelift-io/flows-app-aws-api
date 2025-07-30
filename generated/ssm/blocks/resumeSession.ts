import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ResumeSessionCommand } from "@aws-sdk/client-ssm";

const resumeSession: AppBlock = {
  name: "Resume Session",
  description:
    "Reconnects a session to a managed node after it has been disconnected.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SessionId: {
          name: "Session Id",
          description: "The ID of the disconnected session to resume.",
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

        const command = new ResumeSessionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Resume Session Result",
      description: "Result from ResumeSession operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SessionId: {
            type: "string",
            description: "The ID of the session.",
          },
          TokenValue: {
            type: "string",
            description:
              "An encrypted token value containing session and caller information.",
          },
          StreamUrl: {
            type: "string",
            description:
              "A URL back to SSM Agent on the managed node that the Session Manager client uses to send commands and receive output from the managed node.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resumeSession;
