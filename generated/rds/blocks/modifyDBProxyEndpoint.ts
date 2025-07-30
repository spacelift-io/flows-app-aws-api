import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBProxyEndpointCommand } from "@aws-sdk/client-rds";

const modifyDBProxyEndpoint: AppBlock = {
  name: "Modify DB Proxy Endpoint",
  description: "Changes the settings for an existing DB proxy endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBProxyEndpointName: {
          name: "DB Proxy Endpoint Name",
          description:
            "The name of the DB proxy sociated with the DB proxy endpoint that you want to modify.",
          type: "string",
          required: true,
        },
        NewDBProxyEndpointName: {
          name: "New DB Proxy Endpoint Name",
          description: "The new identifier for the DBProxyEndpoint.",
          type: "string",
          required: false,
        },
        VpcSecurityGroupIds: {
          name: "Vpc Security Group Ids",
          description: "The VPC security group IDs for the DB proxy endpoint.",
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
        });

        const command = new ModifyDBProxyEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Proxy Endpoint Result",
      description: "Result from ModifyDBProxyEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxyEndpoint: {
            type: "object",
            properties: {
              DBProxyEndpointName: {
                type: "string",
              },
              DBProxyEndpointArn: {
                type: "string",
              },
              DBProxyName: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              VpcSecurityGroupIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              VpcSubnetIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Endpoint: {
                type: "string",
              },
              CreatedDate: {
                type: "string",
              },
              TargetRole: {
                type: "string",
              },
              IsDefault: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "The DBProxyEndpoint object representing the new settings for the DB proxy endpoint.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBProxyEndpoint;
