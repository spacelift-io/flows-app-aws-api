import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  CancelUpdateStackCommand,
} from "@aws-sdk/client-cloudformation";

const cancelUpdateStack: AppBlock = {
  name: "Cancel Update Stack",
  description: "Cancels an update on the specified stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "If you don't pass a parameter to StackName, the API returns a response that describes all resources in the account.",
          type: "string",
          required: true,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "A unique identifier for this CancelUpdateStack request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CancelUpdateStackCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Update Stack Result",
      description: "Result from CancelUpdateStack operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default cancelUpdateStack;
