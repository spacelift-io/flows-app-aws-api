import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateCloudFrontOriginAccessIdentityCommand,
} from "@aws-sdk/client-cloudfront";

const createCloudFrontOriginAccessIdentity: AppBlock = {
  name: "Create Cloud Front Origin Access Identity",
  description: "Creates a new origin access identity.",
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
          description:
            "The current configuration information for the identity.",
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

        const command = new CreateCloudFrontOriginAccessIdentityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Cloud Front Origin Access Identity Result",
      description: "Result from CreateCloudFrontOriginAccessIdentity operation",
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
          Location: {
            type: "string",
            description:
              "The fully qualified URI of the new origin access identity just created.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the origin access identity created.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCloudFrontOriginAccessIdentity;
