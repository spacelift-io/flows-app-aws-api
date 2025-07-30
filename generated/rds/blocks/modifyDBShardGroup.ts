import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBShardGroupCommand } from "@aws-sdk/client-rds";

const modifyDBShardGroup: AppBlock = {
  name: "Modify DB Shard Group",
  description:
    "Modifies the settings of an Aurora Limitless Database DB shard group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBShardGroupIdentifier: {
          name: "DB Shard Group Identifier",
          description: "The name of the DB shard group to modify.",
          type: "string",
          required: true,
        },
        MaxACU: {
          name: "Max ACU",
          description:
            "The maximum capacity of the DB shard group in Aurora capacity units (ACUs).",
          type: "number",
          required: false,
        },
        MinACU: {
          name: "Min ACU",
          description:
            "The minimum capacity of the DB shard group in Aurora capacity units (ACUs).",
          type: "number",
          required: false,
        },
        ComputeRedundancy: {
          name: "Compute Redundancy",
          description:
            "Specifies whether to create standby DB shard groups for the DB shard group.",
          type: "number",
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

        const command = new ModifyDBShardGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Shard Group Result",
      description: "Result from ModifyDBShardGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBShardGroupResourceId: {
            type: "string",
            description:
              "The Amazon Web Services Region-unique, immutable identifier for the DB shard group.",
          },
          DBShardGroupIdentifier: {
            type: "string",
            description: "The name of the DB shard group.",
          },
          DBClusterIdentifier: {
            type: "string",
            description:
              "The name of the primary DB cluster for the DB shard group.",
          },
          MaxACU: {
            type: "number",
            description:
              "The maximum capacity of the DB shard group in Aurora capacity units (ACUs).",
          },
          MinACU: {
            type: "number",
            description:
              "The minimum capacity of the DB shard group in Aurora capacity units (ACUs).",
          },
          ComputeRedundancy: {
            type: "number",
            description:
              "Specifies whether to create standby DB shard groups for the DB shard group.",
          },
          Status: {
            type: "string",
            description: "The status of the DB shard group.",
          },
          PubliclyAccessible: {
            type: "boolean",
            description:
              "Indicates whether the DB shard group is publicly accessible.",
          },
          Endpoint: {
            type: "string",
            description: "The connection endpoint for the DB shard group.",
          },
          DBShardGroupArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) for the DB shard group.",
          },
          TagList: {
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
            description: "A list of tags.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBShardGroup;
