import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeClusterTracksCommand,
} from "@aws-sdk/client-redshift";

const describeClusterTracks: AppBlock = {
  name: "Describe Cluster Tracks",
  description: `Returns a list of all the available maintenance tracks.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaintenanceTrackName: {
          name: "Maintenance Track Name",
          description: "The name of the maintenance track.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "An integer value for the maximum number of maintenance tracks to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional parameter that specifies the starting point to return a set of response records.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeClusterTracksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Cluster Tracks Result",
      description: "Result from DescribeClusterTracks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MaintenanceTracks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                MaintenanceTrackName: {
                  type: "string",
                },
                DatabaseVersion: {
                  type: "string",
                },
                UpdateTargets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      MaintenanceTrackName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DatabaseVersion: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SupportedOperations: {
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
            description:
              "A list of maintenance tracks output by the DescribeClusterTracks operation.",
          },
          Marker: {
            type: "string",
            description:
              "The starting point to return a set of response tracklist records.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClusterTracks;
