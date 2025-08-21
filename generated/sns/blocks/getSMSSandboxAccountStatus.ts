import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  GetSMSSandboxAccountStatusCommand,
} from "@aws-sdk/client-sns";

const getSMSSandboxAccountStatus: AppBlock = {
  name: "Get SMS Sandbox Account Status",
  description:
    "Retrieves the SMS sandbox status for the calling Amazon Web Services account in the target Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
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

        const command = new GetSMSSandboxAccountStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get SMS Sandbox Account Status Result",
      description: "Result from GetSMSSandboxAccountStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsInSandbox: {
            type: "boolean",
            description:
              "Indicates whether the calling Amazon Web Services account is in the SMS sandbox.",
          },
        },
        required: ["IsInSandbox"],
      },
    },
  },
};

export default getSMSSandboxAccountStatus;
