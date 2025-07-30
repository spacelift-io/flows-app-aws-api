import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  CreateDBClusterParameterGroupCommand,
} from "@aws-sdk/client-rds";

const createDBClusterParameterGroup: AppBlock = {
  name: "Create DB Cluster Parameter Group",
  description: "Creates a new DB cluster parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterParameterGroupName: {
          name: "DB Cluster Parameter Group Name",
          description: "The name of the DB cluster parameter group.",
          type: "string",
          required: true,
        },
        DBParameterGroupFamily: {
          name: "DB Parameter Group Family",
          description: "The DB cluster parameter group family name.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The description for the DB cluster parameter group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the DB cluster parameter group.",
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

        const command = new CreateDBClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create DB Cluster Parameter Group Result",
      description: "Result from CreateDBClusterParameterGroup operation",
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

export default createDBClusterParameterGroup;
