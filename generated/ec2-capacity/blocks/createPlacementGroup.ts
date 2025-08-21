import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreatePlacementGroupCommand } from "@aws-sdk/client-ec2";

const createPlacementGroup: AppBlock = {
  name: "Create Placement Group",
  description: "Creates a placement group in which to launch instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PartitionCount: {
          name: "Partition Count",
          description: "The number of partitions.",
          type: "number",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the new placement group.",
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
        SpreadLevel: {
          name: "Spread Level",
          description: "Determines how placement groups spread instances.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        GroupName: {
          name: "Group Name",
          description: "A name for the placement group.",
          type: "string",
          required: false,
        },
        Strategy: {
          name: "Strategy",
          description: "The placement strategy.",
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

        const command = new CreatePlacementGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Placement Group Result",
      description: "Result from CreatePlacementGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PlacementGroup: {
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
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
            description: "Information about the placement group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPlacementGroup;
