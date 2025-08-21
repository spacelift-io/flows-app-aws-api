import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateVpcOriginCommand,
} from "@aws-sdk/client-cloudfront";

const createVpcOrigin: AppBlock = {
  name: "Create Vpc Origin",
  description: "Create an Amazon CloudFront VPC origin.",
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
        Tags: {
          name: "Tags",
          description:
            "A complex type that contains zero or more Tag elements.",
          type: {
            type: "object",
            properties: {
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
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

        const command = new CreateVpcOriginCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Vpc Origin Result",
      description: "Result from CreateVpcOrigin operation",
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
          Location: {
            type: "string",
            description: "The VPC origin location.",
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

export default createVpcOrigin;
