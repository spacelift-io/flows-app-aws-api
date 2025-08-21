import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateOriginAccessControlCommand,
} from "@aws-sdk/client-cloudfront";

const createOriginAccessControl: AppBlock = {
  name: "Create Origin Access Control",
  description: "Creates a new origin access control in CloudFront.",
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
          description: "Contains the origin access control.",
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

        const command = new CreateOriginAccessControlCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Origin Access Control Result",
      description: "Result from CreateOriginAccessControl operation",
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
            description: "Contains an origin access control.",
          },
          Location: {
            type: "string",
            description: "The URL of the origin access control.",
          },
          ETag: {
            type: "string",
            description:
              "The version identifier for the current version of the origin access control.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createOriginAccessControl;
