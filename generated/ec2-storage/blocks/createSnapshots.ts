import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateSnapshotsCommand } from "@aws-sdk/client-ec2";

const createSnapshots: AppBlock = {
  name: "Create Snapshots",
  description:
    "Creates crash-consistent snapshots of multiple EBS volumes attached to an Amazon EC2 instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "A description propagated to every snapshot specified by the instance.",
          type: "string",
          required: false,
        },
        InstanceSpecification: {
          name: "Instance Specification",
          description:
            "The instance to specify which volumes should be included in the snapshots.",
          type: {
            type: "object",
            properties: {
              InstanceId: {
                type: "string",
              },
              ExcludeBootVolume: {
                type: "boolean",
              },
              ExcludeDataVolumeIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["InstanceId"],
            additionalProperties: false,
          },
          required: true,
        },
        OutpostArn: {
          name: "Outpost Arn",
          description: "Only supported for instances on Outposts.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "Tags to apply to every snapshot specified by the instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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
        CopyTagsFromSource: {
          name: "Copy Tags From Source",
          description:
            "Copies the tags from the specified volume to corresponding snapshot.",
          type: "string",
          required: false,
        },
        Location: {
          name: "Location",
          description: "Only supported for instances in Local Zones.",
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

        const command = new CreateSnapshotsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Snapshots Result",
      description: "Result from CreateSnapshots operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Snapshots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Description: {
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
                Encrypted: {
                  type: "boolean",
                },
                VolumeId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                VolumeSize: {
                  type: "number",
                },
                StartTime: {
                  type: "string",
                },
                Progress: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                SnapshotId: {
                  type: "string",
                },
                OutpostArn: {
                  type: "string",
                },
                SseType: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "List of snapshots.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSnapshots;
