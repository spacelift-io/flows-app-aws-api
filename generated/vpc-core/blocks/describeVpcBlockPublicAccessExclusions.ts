import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcBlockPublicAccessExclusionsCommand,
} from "@aws-sdk/client-ec2";

const describeVpcBlockPublicAccessExclusions: AppBlock = {
  name: "Describe Vpc Block Public Access Exclusions",
  description: "Describe VPC Block Public Access (BPA) exclusions.",
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
        Filters: {
          name: "Filters",
          description:
            "Filters for the request: resource-arn - The Amazon Resource Name (ARN) of a exclusion.",
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
        ExclusionIds: {
          name: "Exclusion Ids",
          description: "IDs of exclusions.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
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
        });

        const command = new DescribeVpcBlockPublicAccessExclusionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Block Public Access Exclusions Result",
      description:
        "Result from DescribeVpcBlockPublicAccessExclusions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcBlockPublicAccessExclusions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ExclusionId: {
                  type: "string",
                },
                InternetGatewayExclusionMode: {
                  type: "string",
                },
                ResourceArn: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Reason: {
                  type: "string",
                },
                CreationTimestamp: {
                  type: "string",
                },
                LastUpdateTimestamp: {
                  type: "string",
                },
                DeletionTimestamp: {
                  type: "string",
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
              },
              additionalProperties: false,
            },
            description: "Details related to the exclusions.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcBlockPublicAccessExclusions;
