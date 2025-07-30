import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteOriginRequestPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const deleteOriginRequestPolicy: AppBlock = {
  name: "Delete Origin Request Policy",
  description: "Deletes an origin request policy.",
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
            "The unique identifier for the origin request policy that you are deleting.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The version of the origin request policy that you are deleting.",
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
        });

        const command = new DeleteOriginRequestPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Origin Request Policy Result",
      description: "Result from DeleteOriginRequestPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteOriginRequestPolicy;
