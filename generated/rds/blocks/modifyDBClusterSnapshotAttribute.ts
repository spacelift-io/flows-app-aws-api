import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  ModifyDBClusterSnapshotAttributeCommand,
} from "@aws-sdk/client-rds";

const modifyDBClusterSnapshotAttribute: AppBlock = {
  name: "Modify DB Cluster Snapshot Attribute",
  description:
    "Adds an attribute and values to, or removes an attribute and values from, a manual DB cluster snapshot.",
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
            "The identifier for the DB cluster snapshot to modify the attributes for.",
          type: "string",
          required: true,
        },
        AttributeName: {
          name: "Attribute Name",
          description:
            "The name of the DB cluster snapshot attribute to modify.",
          type: "string",
          required: true,
        },
        ValuesToAdd: {
          name: "Values To Add",
          description:
            "A list of DB cluster snapshot attributes to add to the attribute specified by AttributeName.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ValuesToRemove: {
          name: "Values To Remove",
          description:
            "A list of DB cluster snapshot attributes to remove from the attribute specified by AttributeName.",
          type: {
            type: "array",
            items: {
              type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifyDBClusterSnapshotAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Cluster Snapshot Attribute Result",
      description: "Result from ModifyDBClusterSnapshotAttribute operation",
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

export default modifyDBClusterSnapshotAttribute;
