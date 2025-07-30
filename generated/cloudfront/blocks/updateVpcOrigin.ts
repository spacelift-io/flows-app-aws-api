import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateVpcOriginCommand,
} from "@aws-sdk/client-cloudfront";

const updateVpcOrigin: AppBlock = {
  name: "Update Vpc Origin",
  description: "Update an Amazon CloudFront VPC origin in your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcOriginEndpointConfig: {
          name: "Vpc Origin Endpoint Config",
          description: "The VPC origin endpoint configuration.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              HTTPPort: {
                type: "number",
              },
              HTTPSPort: {
                type: "number",
              },
              OriginProtocolPolicy: {
                type: "string",
              },
              OriginSslProtocols: {
                type: "object",
                properties: {
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["Quantity", "Items"],
                additionalProperties: false,
              },
            },
            required: [
              "Name",
              "Arn",
              "HTTPPort",
              "HTTPSPort",
              "OriginProtocolPolicy",
            ],
            additionalProperties: false,
          },
          required: true,
        },
        Id: {
          name: "Id",
          description: "The VPC origin ID.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description: "The VPC origin to update, if a match occurs.",
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
        });

        const command = new UpdateVpcOriginCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Vpc Origin Result",
      description: "Result from UpdateVpcOrigin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcOrigin: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Arn: {
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
              VpcOriginEndpointConfig: {
                type: "object",
                properties: {
                  Name: {
                    type: "string",
                  },
                  Arn: {
                    type: "string",
                  },
                  HTTPPort: {
                    type: "number",
                  },
                  HTTPSPort: {
                    type: "number",
                  },
                  OriginProtocolPolicy: {
                    type: "string",
                  },
                  OriginSslProtocols: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity", "Items"],
                    additionalProperties: false,
                  },
                },
                required: [
                  "Name",
                  "Arn",
                  "HTTPPort",
                  "HTTPSPort",
                  "OriginProtocolPolicy",
                ],
                additionalProperties: false,
              },
            },
            required: [
              "Id",
              "Arn",
              "Status",
              "CreatedTime",
              "LastModifiedTime",
              "VpcOriginEndpointConfig",
            ],
            additionalProperties: false,
            description: "The VPC origin.",
          },
          ETag: {
            type: "string",
            description: "The VPC origin ETag.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateVpcOrigin;
