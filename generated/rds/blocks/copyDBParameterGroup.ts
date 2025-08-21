import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CopyDBParameterGroupCommand } from "@aws-sdk/client-rds";

const copyDBParameterGroup: AppBlock = {
  name: "Copy DB Parameter Group",
  description: "Copies the specified DB parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDBParameterGroupIdentifier: {
          name: "Source DB Parameter Group Identifier",
          description:
            "The identifier or ARN for the source DB parameter group.",
          type: "string",
          required: true,
        },
        TargetDBParameterGroupIdentifier: {
          name: "Target DB Parameter Group Identifier",
          description: "The identifier for the copied DB parameter group.",
          type: "string",
          required: true,
        },
        TargetDBParameterGroupDescription: {
          name: "Target DB Parameter Group Description",
          description: "A description for the copied DB parameter group.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CopyDBParameterGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy DB Parameter Group Result",
      description: "Result from CopyDBParameterGroup operation",
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

export default copyDBParameterGroup;
