import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteResponseHeadersPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const deleteResponseHeadersPolicy: AppBlock = {
  name: "Delete Response Headers Policy",
  description: "Deletes a response headers policy.",
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
            "The identifier for the response headers policy that you are deleting.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The version of the response headers policy that you are deleting.",
          type: "string",
          required: false,
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

        const command = new DeleteResponseHeadersPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Response Headers Policy Result",
      description: "Result from DeleteResponseHeadersPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteResponseHeadersPolicy;
