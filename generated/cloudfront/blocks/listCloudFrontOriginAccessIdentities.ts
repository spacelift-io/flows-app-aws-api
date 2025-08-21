import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListCloudFrontOriginAccessIdentitiesCommand,
} from "@aws-sdk/client-cloudfront";

const listCloudFrontOriginAccessIdentities: AppBlock = {
  name: "List Cloud Front Origin Access Identities",
  description: "Lists origin access identities.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this when paginating results to indicate where to begin in your list of origin access identities.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of origin access identities you want in the response body.",
          type: "number",
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

        const command = new ListCloudFrontOriginAccessIdentitiesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Cloud Front Origin Access Identities Result",
      description: "Result from ListCloudFrontOriginAccessIdentities operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CloudFrontOriginAccessIdentityList: {
            type: "object",
            properties: {
              Marker: {
                type: "string",
              },
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              IsTruncated: {
                type: "boolean",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    S3CanonicalUserId: {
                      type: "string",
                    },
                    Comment: {
                      type: "string",
                    },
                  },
                  required: ["Id", "S3CanonicalUserId", "Comment"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "The CloudFrontOriginAccessIdentityList type.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCloudFrontOriginAccessIdentities;
