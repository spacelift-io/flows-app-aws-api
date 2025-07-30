import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyVpcAttributeCommand } from "@aws-sdk/client-ec2";

const modifyVpcAttribute: AppBlock = {
  name: "Modify Vpc Attribute",
  description: "Modifies the specified attribute of the specified VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EnableDnsHostnames: {
          name: "Enable Dns Hostnames",
          description:
            "Indicates whether the instances launched in the VPC get DNS hostnames.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        EnableDnsSupport: {
          name: "Enable Dns Support",
          description:
            "Indicates whether the DNS resolution is supported for the VPC.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
        },
        EnableNetworkAddressUsageMetrics: {
          name: "Enable Network Address Usage Metrics",
          description:
            "Indicates whether Network Address Usage metrics are enabled for your VPC.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
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

        const command = new ModifyVpcAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Attribute Result",
      description: "Result from ModifyVpcAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcAttribute;
