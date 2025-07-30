import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListOriginAccessControlsCommand,
} from "@aws-sdk/client-cloudfront";

const listOriginAccessControls: AppBlock = {
  name: "List Origin Access Controls",
  description:
    "Gets the list of CloudFront origin access controls (OACs) in this Amazon Web Services account.",
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
            "Use this field when paginating results to indicate where to begin in your list of origin access controls.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of origin access controls that you want in the response.",
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
        });

        const command = new ListOriginAccessControlsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Origin Access Controls Result",
      description: "Result from ListOriginAccessControls operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OriginAccessControlList: {
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
                    Description: {
                      type: "string",
                    },
                    Name: {
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
                    "Id",
                    "Description",
                    "Name",
                    "SigningProtocol",
                    "SigningBehavior",
                    "OriginAccessControlOriginType",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "A list of origin access controls.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOriginAccessControls;
