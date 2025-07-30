import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListAnycastIpListsCommand,
} from "@aws-sdk/client-cloudfront";

const listAnycastIpLists: AppBlock = {
  name: "List Anycast Ip Lists",
  description: "Lists your Anycast static IP lists.",
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
            "Use this field when paginating results to indicate where to begin in your list.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of Anycast static IP lists that you want returned in the response.",
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

        const command = new ListAnycastIpListsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Anycast Ip Lists Result",
      description: "Result from ListAnycastIpLists operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AnycastIpLists: {
            type: "object",
            properties: {
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    Name: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    Arn: {
                      type: "string",
                    },
                    IpCount: {
                      type: "number",
                    },
                    LastModifiedTime: {
                      type: "string",
                    },
                  },
                  required: [
                    "Id",
                    "Name",
                    "Status",
                    "Arn",
                    "IpCount",
                    "LastModifiedTime",
                  ],
                  additionalProperties: false,
                },
              },
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
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "Root level tag for the AnycastIpLists parameters.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAnycastIpLists;
