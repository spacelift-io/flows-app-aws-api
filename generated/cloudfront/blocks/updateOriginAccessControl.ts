import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateOriginAccessControlCommand,
} from "@aws-sdk/client-cloudfront";

const updateOriginAccessControl: AppBlock = {
  name: "Update Origin Access Control",
  description: "Updates a CloudFront origin access control.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OriginAccessControlConfig: {
          name: "Origin Access Control Config",
          description: "An origin access control.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              SigningProtocol: {
                type: "string",
              },
              SigningBehavior: {
                type: "string",
              },
              OriginAccessControlOriginType: {
                type: "string",
              },
            },
            required: [
              "Name",
              "SigningProtocol",
              "SigningBehavior",
              "OriginAccessControlOriginType",
            ],
            additionalProperties: false,
          },
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The unique identifier of the origin access control that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the origin access control that you are updating.",
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

        const command = new UpdateOriginAccessControlCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Origin Access Control Result",
      description: "Result from UpdateOriginAccessControl operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OriginAccessControl: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              OriginAccessControlConfig: {
                type: "object",
                properties: {
                  Name: {
                    type: "string",
                  },
                  Description: {
                    type: "string",
                  },
                  SigningProtocol: {
                    type: "string",
                  },
                  SigningBehavior: {
                    type: "string",
                  },
                  OriginAccessControlOriginType: {
                    type: "string",
                  },
                },
                required: [
                  "Name",
                  "SigningProtocol",
                  "SigningBehavior",
                  "OriginAccessControlOriginType",
                ],
                additionalProperties: false,
              },
            },
            required: ["Id"],
            additionalProperties: false,
            description: "The origin access control after it has been updated.",
          },
          ETag: {
            type: "string",
            description:
              "The new version of the origin access control after it has been updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateOriginAccessControl;
