import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  UpdateTrafficPolicyCommentCommand,
} from "@aws-sdk/client-route-53";

const updateTrafficPolicyComment: AppBlock = {
  name: "Update Traffic Policy Comment",
  description: "Updates the comment for a specified traffic policy version.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The value of Id for the traffic policy that you want to update the comment for.",
          type: "string",
          required: true,
        },
        Version: {
          name: "Version",
          description:
            "The value of Version for the traffic policy that you want to update the comment for.",
          type: "number",
          required: true,
        },
        Comment: {
          name: "Comment",
          description:
            "The new comment for the specified traffic policy and version.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new UpdateTrafficPolicyCommentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Traffic Policy Comment Result",
      description: "Result from UpdateTrafficPolicyComment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrafficPolicy: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Version: {
                type: "number",
              },
              Name: {
                type: "string",
              },
              Type: {
                type: "string",
              },
              Document: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Version", "Name", "Type", "Document"],
            additionalProperties: false,
            description:
              "A complex type that contains settings for the specified traffic policy.",
          },
        },
        required: ["TrafficPolicy"],
      },
    },
  },
};

export default updateTrafficPolicyComment;
