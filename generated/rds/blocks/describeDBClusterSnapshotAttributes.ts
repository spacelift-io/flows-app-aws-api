import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBClusterSnapshotAttributesCommand,
} from "@aws-sdk/client-rds";

const describeDBClusterSnapshotAttributes: AppBlock = {
  name: "Describe DB Cluster Snapshot Attributes",
  description:
    "Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterSnapshotIdentifier: {
          name: "DB Cluster Snapshot Identifier",
          description:
            "The identifier for the DB cluster snapshot to describe the attributes for.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeDBClusterSnapshotAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Cluster Snapshot Attributes Result",
      description: "Result from DescribeDBClusterSnapshotAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterSnapshotAttributesResult: {
            type: "object",
            properties: {
              DBClusterSnapshotIdentifier: {
                type: "string",
              },
              DBClusterSnapshotAttributes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AttributeName: {
                      type: "string",
                    },
                    AttributeValues: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Contains the results of a successful call to the DescribeDBClusterSnapshotAttributes API action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBClusterSnapshotAttributes;
