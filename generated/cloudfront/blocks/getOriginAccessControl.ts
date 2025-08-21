import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetOriginAccessControlCommand,
} from "@aws-sdk/client-cloudfront";

const getOriginAccessControl: AppBlock = {
  name: "Get Origin Access Control",
  description:
    "Gets a CloudFront origin access control, including its unique identifier.",
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

        const command = new GetOriginAccessControlCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Origin Access Control Result",
      description: "Result from GetOriginAccessControl operation",
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
            description:
              "Contains an origin access control, including its unique identifier.",
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

export default getOriginAccessControl;
