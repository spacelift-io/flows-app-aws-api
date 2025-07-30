import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeElasticGpusCommand } from "@aws-sdk/client-ec2";

const describeElasticGpus: AppBlock = {
  name: "Describe Elastic Gpus",
  description:
    "Amazon Elastic Graphics reached end of life on January 8, 2024.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ElasticGpuIds: {
          name: "Elastic Gpu Ids",
          description: "The Elastic Graphics accelerator IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to request the next page of results.",
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
        });

        const command = new DescribeElasticGpusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Elastic Gpus Result",
      description: "Result from DescribeElasticGpus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ElasticGpuSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ElasticGpuId: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                ElasticGpuType: {
                  type: "string",
                },
                ElasticGpuHealth: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ElasticGpuState: {
                  type: "string",
                },
                InstanceId: {
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
            description: "Information about the Elastic Graphics accelerators.",
          },
          MaxResults: {
            type: "number",
            description: "The total number of items to return.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeElasticGpus;
