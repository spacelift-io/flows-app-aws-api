import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteCloudFrontOriginAccessIdentityCommand,
} from "@aws-sdk/client-cloudfront";

const deleteCloudFrontOriginAccessIdentity: AppBlock = {
  name: "Delete Cloud Front Origin Access Identity",
  description: "Delete an origin access identity.",
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
          description: "The origin access identity's ID.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header you received from a previous GET or PUT request.",
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

        const command = new DeleteCloudFrontOriginAccessIdentityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Cloud Front Origin Access Identity Result",
      description: "Result from DeleteCloudFrontOriginAccessIdentity operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteCloudFrontOriginAccessIdentity;
