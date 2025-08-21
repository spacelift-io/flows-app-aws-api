import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetCloudFrontOriginAccessIdentityConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getCloudFrontOriginAccessIdentityConfig: AppBlock = {
  name: "Get Cloud Front Origin Access Identity Config",
  description:
    "Get the configuration information about an origin access identity.",
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
          description: "The identity's ID.",
          type: "string",
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

        const command = new GetCloudFrontOriginAccessIdentityConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Cloud Front Origin Access Identity Config Result",
      description:
        "Result from GetCloudFrontOriginAccessIdentityConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CloudFrontOriginAccessIdentityConfig: {
            type: "object",
            properties: {
              CallerReference: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["CallerReference", "Comment"],
            additionalProperties: false,
            description:
              "The origin access identity's configuration information.",
          },
          ETag: {
            type: "string",
            description: "The current version of the configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCloudFrontOriginAccessIdentityConfig;
