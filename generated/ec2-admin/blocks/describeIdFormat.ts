import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeIdFormatCommand } from "@aws-sdk/client-ec2";

const describeIdFormat: AppBlock = {
  name: "Describe Id Format",
  description:
    "Describes the ID format settings for your resources on a per-Region basis, for example, to view which resource types are enabled for longer IDs.",
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

        const command = new DescribeIdFormatCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Id Format Result",
      description: "Result from DescribeIdFormat operation",
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
            description: "Information about the ID format for the resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeIdFormat;
