import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetAnycastIpListCommand,
} from "@aws-sdk/client-cloudfront";

const getAnycastIpList: AppBlock = {
  name: "Get Anycast Ip List",
  description: "Gets an Anycast static IP list.",
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
          description: "The ID of the Anycast static IP list.",
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

        const command = new GetAnycastIpListCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Anycast Ip List Result",
      description: "Result from GetAnycastIpList operation",
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
            description: "The Anycast static IP list details.",
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

export default getAnycastIpList;
