import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, TerminateSessionCommand } from "@aws-sdk/client-ssm";

const terminateSession: AppBlock = {
  name: "Terminate Session",
  description:
    "Permanently ends a session and closes the data connection between the Session Manager client and SSM Agent on the managed node.",
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
          description: "The ID of the session to terminate.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new TerminateSessionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Terminate Session Result",
      description: "Result from TerminateSession operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SessionId: {
            type: "string",
            description: "The ID of the session that has been terminated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default terminateSession;
