import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcBlockPublicAccessOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcBlockPublicAccessOptions: AppBlock = {
  name: "Modify Vpc Block Public Access Options",
  description: "Modify VPC Block Public Access (BPA) options.",
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
        InternetGatewayBlockMode: {
          name: "Internet Gateway Block Mode",
          description: "The mode of VPC BPA.",
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

        const command = new ModifyVpcBlockPublicAccessOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Block Public Access Options Result",
      description: "Result from ModifyVpcBlockPublicAccessOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcBlockPublicAccessOptions: {
            type: "object",
            properties: {
              AwsAccountId: {
                type: "string",
              },
              AwsRegion: {
                type: "string",
              },
              State: {
                type: "string",
              },
              InternetGatewayBlockMode: {
                type: "string",
              },
              Reason: {
                type: "string",
              },
              LastUpdateTimestamp: {
                type: "string",
              },
              ManagedBy: {
                type: "string",
              },
              ExclusionsAllowed: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Details related to the VPC Block Public Access (BPA) options.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcBlockPublicAccessOptions;
