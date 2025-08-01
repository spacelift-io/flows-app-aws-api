import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  CopyDBClusterParameterGroupCommand,
} from "@aws-sdk/client-rds";

const copyDBClusterParameterGroup: AppBlock = {
  name: "Copy DB Cluster Parameter Group",
  description: "Copies the specified DB cluster parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDBClusterParameterGroupIdentifier: {
          name: "Source DB Cluster Parameter Group Identifier",
          description:
            "The identifier or Amazon Resource Name (ARN) for the source DB cluster parameter group.",
          type: "string",
          required: true,
        },
        TargetDBClusterParameterGroupIdentifier: {
          name: "Target DB Cluster Parameter Group Identifier",
          description:
            "The identifier for the copied DB cluster parameter group.",
          type: "string",
          required: true,
        },
        TargetDBClusterParameterGroupDescription: {
          name: "Target DB Cluster Parameter Group Description",
          description:
            "A description for the copied DB cluster parameter group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags.",
          type: {
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

        const command = new CopyDBClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy DB Cluster Parameter Group Result",
      description: "Result from CopyDBClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterParameterGroup: {
            type: "object",
            properties: {
              DBClusterParameterGroupName: {
                type: "string",
              },
              DBParameterGroupFamily: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              DBClusterParameterGroupArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the details of an Amazon RDS DB cluster parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default copyDBClusterParameterGroup;
