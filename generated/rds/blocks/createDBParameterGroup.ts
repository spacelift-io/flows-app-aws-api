import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateDBParameterGroupCommand } from "@aws-sdk/client-rds";

const createDBParameterGroup: AppBlock = {
  name: "Create DB Parameter Group",
  description: "Creates a new DB parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBParameterGroupName: {
          name: "DB Parameter Group Name",
          description: "The name of the DB parameter group.",
          type: "string",
          required: true,
        },
        DBParameterGroupFamily: {
          name: "DB Parameter Group Family",
          description: "The DB parameter group family name.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The description for the DB parameter group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the DB parameter group.",
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

        const command = new CreateDBParameterGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create DB Parameter Group Result",
      description: "Result from CreateDBParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBParameterGroup: {
            type: "object",
            properties: {
              DBParameterGroupName: {
                type: "string",
              },
              DBParameterGroupFamily: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              DBParameterGroupArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the details of an Amazon RDS DB parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDBParameterGroup;
