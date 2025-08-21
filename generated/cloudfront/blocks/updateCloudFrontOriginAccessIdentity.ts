import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateCloudFrontOriginAccessIdentityCommand,
} from "@aws-sdk/client-cloudfront";

const updateCloudFrontOriginAccessIdentity: AppBlock = {
  name: "Update Cloud Front Origin Access Identity",
  description: "Update an origin access identity.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CloudFrontOriginAccessIdentityConfig: {
          name: "Cloud Front Origin Access Identity Config",
          description: "The identity's configuration information.",
          type: {
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
          required: true,
        },
        Id: {
          name: "Id",
          description: "The identity's id.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the identity's configuration.",
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

        const command = new UpdateCloudFrontOriginAccessIdentityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Cloud Front Origin Access Identity Result",
      description: "Result from UpdateCloudFrontOriginAccessIdentity operation",
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
            description: "The current version of the configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateCloudFrontOriginAccessIdentity;
