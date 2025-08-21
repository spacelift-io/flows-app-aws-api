import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateSecurityGroupVpcCommand,
} from "@aws-sdk/client-ec2";

const associateSecurityGroupVpc: AppBlock = {
  name: "Associate Security Group Vpc",
  description:
    "Associates a security group with another VPC in the same Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GroupId: {
          name: "Group Id",
          description: "A security group ID.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "A VPC ID.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new AssociateSecurityGroupVpcCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Security Group Vpc Result",
      description: "Result from AssociateSecurityGroupVpc operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description: "The state of the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateSecurityGroupVpc;
