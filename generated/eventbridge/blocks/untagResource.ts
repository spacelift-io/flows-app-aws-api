import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  UntagResourceCommand,
} from "@aws-sdk/client-eventbridge";

const untagResource: AppBlock = {
  name: "Untag Resource",
  description:
    "Removes one or more tags from the specified EventBridge resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceARN: {
          name: "Resource ARN",
          description:
            "The ARN of the EventBridge resource from which you are removing tags.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "The list of tag keys to remove from the resource.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new UntagResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Resource Result",
      description: "Result from UntagResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default untagResource;
