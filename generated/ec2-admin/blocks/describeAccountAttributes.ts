import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAccountAttributesCommand,
} from "@aws-sdk/client-ec2";

const describeAccountAttributes: AppBlock = {
  name: "Describe Account Attributes",
  description: "Describes attributes of your Amazon Web Services account.",
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
        AttributeNames: {
          name: "Attribute Names",
          description: "The account attribute names.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeAccountAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Account Attributes Result",
      description: "Result from DescribeAccountAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountAttributes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeName: {
                  type: "string",
                },
                AttributeValues: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AttributeValue: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the account attributes.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAccountAttributes;
