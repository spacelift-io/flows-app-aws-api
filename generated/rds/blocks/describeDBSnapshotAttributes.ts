import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBSnapshotAttributesCommand,
} from "@aws-sdk/client-rds";

const describeDBSnapshotAttributes: AppBlock = {
  name: "Describe DB Snapshot Attributes",
  description:
    "Returns a list of DB snapshot attribute names and values for a manual DB snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSnapshotIdentifier: {
          name: "DB Snapshot Identifier",
          description:
            "The identifier for the DB snapshot to describe the attributes for.",
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
        });

        const command = new DescribeDBSnapshotAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Snapshot Attributes Result",
      description: "Result from DescribeDBSnapshotAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBSnapshotAttributesResult: {
            type: "object",
            properties: {
              DBSnapshotIdentifier: {
                type: "string",
              },
              DBSnapshotAttributes: {
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
              "Contains the results of a successful call to the DescribeDBSnapshotAttributes API action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBSnapshotAttributes;
