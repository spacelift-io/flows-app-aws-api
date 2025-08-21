import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetOriginAccessControlConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getOriginAccessControlConfig: AppBlock = {
  name: "Get Origin Access Control Config",
  description: "Gets a CloudFront origin access control configuration.",
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
          description: "The unique identifier of the origin access control.",
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

        const command = new GetOriginAccessControlConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Origin Access Control Config Result",
      description: "Result from GetOriginAccessControlConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description: "Contains an origin access control configuration.",
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

export default getOriginAccessControlConfig;
