import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVpcClassicLinkCommand } from "@aws-sdk/client-ec2";

const describeVpcClassicLink: AppBlock = {
  name: "Describe Vpc Classic Link",
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
        VpcIds: {
          name: "Vpc Ids",
          description:
            "The VPCs for which you want to describe the ClassicLink status.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
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

        const command = new DescribeVpcClassicLinkCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Classic Link Result",
      description: "Result from DescribeVpcClassicLink operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Vpcs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClassicLinkEnabled: {
                  type: "boolean",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                VpcId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The ClassicLink status of the VPCs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcClassicLink;
