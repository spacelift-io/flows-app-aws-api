import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpcAttributeCommand } from "@aws-sdk/client-ec2";

const describeVpcAttribute: AppBlock = {
  name: "Describe Vpc Attribute",
  description: "Describes the specified attribute of the specified VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description: "The VPC attribute.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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
        });

        const command = new DescribeVpcAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Attribute Result",
      description: "Result from DescribeVpcAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EnableDnsHostnames: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Indicates whether the instances launched in the VPC get DNS hostnames.",
          },
          EnableDnsSupport: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Indicates whether DNS resolution is enabled for the VPC.",
          },
          EnableNetworkAddressUsageMetrics: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Indicates whether Network Address Usage metrics are enabled for your VPC.",
          },
          VpcId: {
            type: "string",
            description: "The ID of the VPC.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcAttribute;
