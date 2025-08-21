import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  CreatePartnerEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const createPartnerEventSource: AppBlock = {
  name: "Create Partner Event Source",
  description: "Called by an SaaS partner to create a partner event source.",
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
          description: "The name of the partner event source.",
          type: "string",
          required: true,
        },
        Account: {
          name: "Account",
          description:
            "The Amazon Web Services account ID that is permitted to create a matching partner event bus for this partner event source.",
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

        const command = new CreatePartnerEventSourceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Partner Event Source Result",
      description: "Result from CreatePartnerEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventSourceArn: {
            type: "string",
            description: "The ARN of the partner event source.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPartnerEventSource;
