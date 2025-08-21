import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribePlacementGroupsCommand } from "@aws-sdk/client-ec2";

const describePlacementGroups: AppBlock = {
  name: "Describe Placement Groups",
  description:
    "Describes the specified placement groups or all of your placement groups.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GroupIds: {
          name: "Group Ids",
          description: "The IDs of the placement groups.",
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
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        GroupNames: {
          name: "Group Names",
          description: "The names of the placement groups.",
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

        const command = new DescribePlacementGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Placement Groups Result",
      description: "Result from DescribePlacementGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PlacementGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupName: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Strategy: {
                  type: "string",
                },
                PartitionCount: {
                  type: "number",
                },
                GroupId: {
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
                GroupArn: {
                  type: "string",
                },
                SpreadLevel: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the placement groups.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePlacementGroups;
