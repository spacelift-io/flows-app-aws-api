import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, RestoreAddressToClassicCommand } from "@aws-sdk/client-ec2";

const restoreAddressToClassic: AppBlock = {
  name: "Restore Address To Classic",
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
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        PublicIp: {
          name: "Public Ip",
          description: "The Elastic IP address.",
          type: "string",
          required: true,
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

        const command = new RestoreAddressToClassicCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Address To Classic Result",
      description: "Result from RestoreAddressToClassic operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicIp: {
            type: "string",
            description: "The Elastic IP address.",
          },
          Status: {
            type: "string",
            description: "The move status for the IP address.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreAddressToClassic;
