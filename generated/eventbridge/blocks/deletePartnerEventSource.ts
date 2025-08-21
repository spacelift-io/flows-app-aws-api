import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DeletePartnerEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const deletePartnerEventSource: AppBlock = {
  name: "Delete Partner Event Source",
  description:
    "This operation is used by SaaS partners to delete a partner event source.",
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
          description: "The name of the event source to delete.",
          type: "string",
          required: true,
        },
        Account: {
          name: "Account",
          description:
            "The Amazon Web Services account ID of the Amazon Web Services customer that the event source was created for.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeletePartnerEventSourceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Partner Event Source Result",
      description: "Result from DeletePartnerEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deletePartnerEventSource;
