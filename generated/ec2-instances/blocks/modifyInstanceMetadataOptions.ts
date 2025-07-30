import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceMetadataOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceMetadataOptions: AppBlock = {
  name: "Modify Instance Metadata Options",
  description:
    "Modify the instance metadata parameters on a running or stopped instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        HttpTokens: {
          name: "Http Tokens",
          description: "Indicates whether IMDSv2 is required.",
          type: "string",
          required: false,
        },
        HttpPutResponseHopLimit: {
          name: "Http Put Response Hop Limit",
          description:
            "The desired HTTP PUT response hop limit for instance metadata requests.",
          type: "number",
          required: false,
        },
        HttpEndpoint: {
          name: "Http Endpoint",
          description:
            "Enables or disables the HTTP metadata endpoint on your instances.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        HttpProtocolIpv6: {
          name: "Http Protocol Ipv6",
          description:
            "Enables or disables the IPv6 endpoint for the instance metadata service.",
          type: "string",
          required: false,
        },
        InstanceMetadataTags: {
          name: "Instance Metadata Tags",
          description:
            "Set to enabled to allow access to instance tags from the instance metadata.",
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
        });

        const command = new ModifyInstanceMetadataOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Metadata Options Result",
      description: "Result from ModifyInstanceMetadataOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the instance.",
          },
          InstanceMetadataOptions: {
            type: "object",
            properties: {
              State: {
                type: "string",
              },
              HttpTokens: {
                type: "string",
              },
              HttpPutResponseHopLimit: {
                type: "number",
              },
              HttpEndpoint: {
                type: "string",
              },
              HttpProtocolIpv6: {
                type: "string",
              },
              InstanceMetadataTags: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The metadata options for the instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceMetadataOptions;
