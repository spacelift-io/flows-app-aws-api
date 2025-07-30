import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeIdentityIdFormatCommand,
} from "@aws-sdk/client-ec2";

const describeIdentityIdFormat: AppBlock = {
  name: "Describe Identity Id Format",
  description:
    "Describes the ID format settings for resources for the specified IAM user, IAM role, or root user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Resource: {
          name: "Resource",
          description:
            "The type of resource: bundle | conversion-task | customer-gateway | dhcp-options | elastic-ip-alloca...",
          type: "string",
          required: false,
        },
        PrincipalArn: {
          name: "Principal Arn",
          description:
            "The ARN of the principal, which can be an IAM role, IAM user, or the root user.",
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
        });

        const command = new DescribeIdentityIdFormatCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Identity Id Format Result",
      description: "Result from DescribeIdentityIdFormat operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Statuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Deadline: {
                  type: "string",
                },
                Resource: {
                  type: "string",
                },
                UseLongIds: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the ID format for the resources.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeIdentityIdFormat;
