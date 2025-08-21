import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UntagResourceCommand,
} from "@aws-sdk/client-cloudfront";

const untagResource: AppBlock = {
  name: "Untag Resource",
  description: "Remove tags from a CloudFront resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Resource: {
          name: "Resource",
          description: "An ARN of a CloudFront resource.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description:
            "A complex type that contains zero or more Tag key elements.",
          type: {
            type: "object",
            properties: {
              Items: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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
        additionalProperties: true,
      },
    },
  },
};

export default untagResource;
