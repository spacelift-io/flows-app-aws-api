import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateAnycastIpListCommand,
} from "@aws-sdk/client-cloudfront";

const createAnycastIpList: AppBlock = {
  name: "Create Anycast Ip List",
  description: "Creates an Anycast static IP list.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "Name of the Anycast static IP list.",
          type: "string",
          required: true,
        },
        IpCount: {
          name: "Ip Count",
          description:
            "The number of static IP addresses that are allocated to the Anycast static IP list.",
          type: "number",
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

        const command = new CreateAnycastIpListCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Anycast Ip List Result",
      description: "Result from CreateAnycastIpList operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AnycastIpList: {
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
              AnycastIps: {
                type: "array",
                items: {
                  type: "string",
                },
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
              "AnycastIps",
              "IpCount",
              "LastModifiedTime",
            ],
            additionalProperties: false,
            description:
              "A response structure that includes the version identifier (ETag) and the created AnycastIpList structure.",
          },
          ETag: {
            type: "string",
            description:
              "The version identifier for the current version of the Anycast static IP list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createAnycastIpList;
