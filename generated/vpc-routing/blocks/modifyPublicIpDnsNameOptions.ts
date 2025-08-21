import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyPublicIpDnsNameOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyPublicIpDnsNameOptions: AppBlock = {
  name: "Modify Public Ip Dns Name Options",
  description: "Modify public hostname options for a network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "A network interface ID.",
          type: "string",
          required: true,
        },
        HostnameType: {
          name: "Hostname Type",
          description: "The public hostname type.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
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

        const command = new ModifyPublicIpDnsNameOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Public Ip Dns Name Options Result",
      description: "Result from ModifyPublicIpDnsNameOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "boolean",
            description: "Whether or not the request was successful.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyPublicIpDnsNameOptions;
