import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBProxyEndpointCommand } from "@aws-sdk/client-rds";

const deleteDBProxyEndpoint: AppBlock = {
  name: "Delete DB Proxy Endpoint",
  description: "Deletes a DBProxyEndpoint.",
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
          description: "The name of the DB proxy endpoint to delete.",
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

        const command = new DeleteDBProxyEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Proxy Endpoint Result",
      description: "Result from DeleteDBProxyEndpoint operation",
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
              "The data structure representing the details of the DB proxy endpoint that you delete.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBProxyEndpoint;
