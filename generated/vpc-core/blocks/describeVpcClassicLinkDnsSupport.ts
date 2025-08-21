import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcClassicLinkDnsSupportCommand,
} from "@aws-sdk/client-ec2";

const describeVpcClassicLinkDnsSupport: AppBlock = {
  name: "Describe Vpc Classic Link Dns Support",
  description: "This action is deprecated.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcIds: {
          name: "Vpc Ids",
          description: "The IDs of the VPCs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DescribeVpcClassicLinkDnsSupportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Classic Link Dns Support Result",
      description: "Result from DescribeVpcClassicLinkDnsSupport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          Vpcs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClassicLinkDnsSupported: {
                  type: "boolean",
                },
                VpcId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the ClassicLink DNS support status of the VPCs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcClassicLinkDnsSupport;
