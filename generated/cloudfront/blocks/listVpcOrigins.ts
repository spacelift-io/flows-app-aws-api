import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListVpcOriginsCommand,
} from "@aws-sdk/client-cloudfront";

const listVpcOrigins: AppBlock = {
  name: "List Vpc Origins",
  description: "List the CloudFront VPC origins in your account.",
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
          description: "The marker associated with the VPC origins list.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of items included in the list.",
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

        const command = new ListVpcOriginsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Vpc Origins Result",
      description: "Result from ListVpcOrigins operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcOriginList: {
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
                    Name: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    CreatedTime: {
                      type: "string",
                    },
                    LastModifiedTime: {
                      type: "string",
                    },
                    Arn: {
                      type: "string",
                    },
                    OriginEndpointArn: {
                      type: "string",
                    },
                  },
                  required: [
                    "Id",
                    "Name",
                    "Status",
                    "CreatedTime",
                    "LastModifiedTime",
                    "Arn",
                    "OriginEndpointArn",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "List of VPC origins.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listVpcOrigins;
