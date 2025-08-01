import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVolumesCommand } from "@aws-sdk/client-ec2";

const describeVolumes: AppBlock = {
  name: "Describe Volumes",
  description:
    "Describes the specified EBS volumes or all of your EBS volumes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VolumeIds: {
          name: "Volume Ids",
          description: "The volume IDs.",
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

        const command = new DescribeVolumesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Volumes Result",
      description: "Result from DescribeVolumes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          Volumes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OutpostArn: {
                  type: "string",
                },
                Iops: {
                  type: "number",
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
                VolumeType: {
                  type: "string",
                },
                FastRestored: {
                  type: "boolean",
                },
                MultiAttachEnabled: {
                  type: "boolean",
                },
                Throughput: {
                  type: "number",
                },
                SseType: {
                  type: "string",
                },
                Operator: {
                  type: "object",
                  properties: {
                    Managed: {
                      type: "boolean",
                    },
                    Principal: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                VolumeInitializationRate: {
                  type: "number",
                },
                VolumeId: {
                  type: "string",
                },
                Size: {
                  type: "number",
                },
                SnapshotId: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                CreateTime: {
                  type: "string",
                },
                Attachments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      DeleteOnTermination: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AssociatedResource: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceOwningService: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VolumeId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Device: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AttachTime: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Encrypted: {
                  type: "boolean",
                },
                KmsKeyId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the volumes.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVolumes;
