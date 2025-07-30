import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVolumesModificationsCommand,
} from "@aws-sdk/client-ec2";

const describeVolumesModifications: AppBlock = {
  name: "Describe Volumes Modifications",
  description:
    "Describes the most recent volume modification request for the specified EBS volumes.",
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
        VolumeIds: {
          name: "Volume Ids",
          description: "The IDs of the volumes.",
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
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results (up to a limit of 500) to be returned in a paginated request.",
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

        const command = new DescribeVolumesModificationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Volumes Modifications Result",
      description: "Result from DescribeVolumesModifications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          VolumesModifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                VolumeId: {
                  type: "string",
                },
                ModificationState: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                TargetSize: {
                  type: "number",
                },
                TargetIops: {
                  type: "number",
                },
                TargetVolumeType: {
                  type: "string",
                },
                TargetThroughput: {
                  type: "number",
                },
                TargetMultiAttachEnabled: {
                  type: "boolean",
                },
                OriginalSize: {
                  type: "number",
                },
                OriginalIops: {
                  type: "number",
                },
                OriginalVolumeType: {
                  type: "string",
                },
                OriginalThroughput: {
                  type: "number",
                },
                OriginalMultiAttachEnabled: {
                  type: "boolean",
                },
                Progress: {
                  type: "number",
                },
                StartTime: {
                  type: "string",
                },
                EndTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the volume modifications.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVolumesModifications;
