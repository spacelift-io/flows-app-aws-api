import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

const describeRegions: AppBlock = {
  name: "Describe Regions",
  description:
    "Describes the Regions that are enabled for your account, or all Regions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RegionNames: {
          name: "Region Names",
          description: "The names of the Regions.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        AllRegions: {
          name: "All Regions",
          description:
            "Indicates whether to display all Regions, including Regions that are disabled for your account.",
          type: "boolean",
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

        const command = new DescribeRegionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Regions Result",
      description: "Result from DescribeRegions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Regions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OptInStatus: {
                  type: "string",
                },
                RegionName: {
                  type: "string",
                },
                Endpoint: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Regions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRegions;
