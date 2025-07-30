import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeSourceRegionsCommand } from "@aws-sdk/client-rds";

const describeSourceRegions: AppBlock = {
  name: "Describe Source Regions",
  description:
    "Returns a list of the source Amazon Web Services Regions where the current Amazon Web Services Region can create a read replica, copy a DB snapshot from, or replicate automated backups from.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RegionName: {
          name: "Region Name",
          description: "The source Amazon Web Services Region name.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeSourceRegions request.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
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
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeSourceRegionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Source Regions Result",
      description: "Result from DescribeSourceRegions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          SourceRegions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RegionName: {
                  type: "string",
                },
                Endpoint: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                SupportsDBInstanceAutomatedBackupsReplication: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of SourceRegion instances that contains each source Amazon Web Services Region that the current Amazon Web Services Region can get a read replica or a DB snapshot from.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSourceRegions;
