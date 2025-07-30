import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBProxyCommand } from "@aws-sdk/client-rds";

const deleteDBProxy: AppBlock = {
  name: "Delete DB Proxy",
  description: "Deletes an existing DB proxy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBProxyName: {
          name: "DB Proxy Name",
          description: "The name of the DB proxy to delete.",
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

        const command = new DeleteDBProxyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Proxy Result",
      description: "Result from DeleteDBProxy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxy: {
            type: "object",
            properties: {
              DBProxyName: {
                type: "string",
              },
              DBProxyArn: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              EngineFamily: {
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
              Auth: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Description: {
                      type: "string",
                    },
                    UserName: {
                      type: "string",
                    },
                    AuthScheme: {
                      type: "string",
                    },
                    SecretArn: {
                      type: "string",
                    },
                    IAMAuth: {
                      type: "string",
                    },
                    ClientPasswordAuthType: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              RoleArn: {
                type: "string",
              },
              Endpoint: {
                type: "string",
              },
              RequireTLS: {
                type: "boolean",
              },
              IdleClientTimeout: {
                type: "number",
              },
              DebugLogging: {
                type: "boolean",
              },
              CreatedDate: {
                type: "string",
              },
              UpdatedDate: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The data structure representing the details of the DB proxy that you delete.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBProxy;
