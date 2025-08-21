import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyPrivateDnsNameOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyPrivateDnsNameOptions: AppBlock = {
  name: "Modify Private Dns Name Options",
  description:
    "Modifies the options for instance hostnames for the specified instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        PrivateDnsHostnameType: {
          name: "Private Dns Hostname Type",
          description: "The type of hostname for EC2 instances.",
          type: "string",
          required: false,
        },
        EnableResourceNameDnsARecord: {
          name: "Enable Resource Name Dns A Record",
          description:
            "Indicates whether to respond to DNS queries for instance hostnames with DNS A records.",
          type: "boolean",
          required: false,
        },
        EnableResourceNameDnsAAAARecord: {
          name: "Enable Resource Name Dns AAAA Record",
          description:
            "Indicates whether to respond to DNS queries for instance hostnames with DNS AAAA records.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifyPrivateDnsNameOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Private Dns Name Options Result",
      description: "Result from ModifyPrivateDnsNameOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyPrivateDnsNameOptions;
