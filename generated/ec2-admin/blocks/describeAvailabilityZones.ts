import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAvailabilityZonesCommand,
} from "@aws-sdk/client-ec2";

const describeAvailabilityZones: AppBlock = {
  name: "Describe Availability Zones",
  description:
    "Describes the Availability Zones, Local Zones, and Wavelength Zones that are available to you.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ZoneNames: {
          name: "Zone Names",
          description:
            "The names of the Availability Zones, Local Zones, and Wavelength Zones.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ZoneIds: {
          name: "Zone Ids",
          description:
            "The IDs of the Availability Zones, Local Zones, and Wavelength Zones.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        AllAvailabilityZones: {
          name: "All Availability Zones",
          description:
            "Include all Availability Zones, Local Zones, and Wavelength Zones regardless of your opt-in status.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeAvailabilityZonesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Availability Zones Result",
      description: "Result from DescribeAvailabilityZones operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AvailabilityZones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OptInStatus: {
                  type: "string",
                },
                Messages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Message: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                RegionName: {
                  type: "string",
                },
                ZoneName: {
                  type: "string",
                },
                ZoneId: {
                  type: "string",
                },
                GroupName: {
                  type: "string",
                },
                NetworkBorderGroup: {
                  type: "string",
                },
                ZoneType: {
                  type: "string",
                },
                ParentZoneName: {
                  type: "string",
                },
                ParentZoneId: {
                  type: "string",
                },
                GroupLongName: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the Availability Zones, Local Zones, and Wavelength Zones.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAvailabilityZones;
