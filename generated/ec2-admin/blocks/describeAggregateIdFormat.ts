import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAggregateIdFormatCommand,
} from "@aws-sdk/client-ec2";

const describeAggregateIdFormat: AppBlock = {
  name: "Describe Aggregate Id Format",
  description:
    "Describes the longer ID format settings for all resource types in a specific Region.",
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

        const command = new DescribeAggregateIdFormatCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Aggregate Id Format Result",
      description: "Result from DescribeAggregateIdFormat operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UseLongIdsAggregated: {
            type: "boolean",
            description:
              "Indicates whether all resource types in the Region are configured to use longer IDs.",
          },
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
            description: "Information about each resource's ID format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAggregateIdFormat;
