import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetCloudFrontOriginAccessIdentityCommand,
} from "@aws-sdk/client-cloudfront";

const getCloudFrontOriginAccessIdentity: AppBlock = {
  name: "Get Cloud Front Origin Access Identity",
  description: "Get the information about an origin access identity.",
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

        const command = new GetCloudFrontOriginAccessIdentityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Cloud Front Origin Access Identity Result",
      description: "Result from GetCloudFrontOriginAccessIdentity operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CloudFrontOriginAccessIdentity: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              S3CanonicalUserId: {
                type: "string",
              },
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
              },
            },
            required: ["Id", "S3CanonicalUserId"],
            additionalProperties: false,
            description: "The origin access identity's information.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the origin access identity's information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCloudFrontOriginAccessIdentity;
