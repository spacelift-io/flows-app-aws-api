import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBProxyCommand } from "@aws-sdk/client-rds";

const modifyDBProxy: AppBlock = {
  name: "Modify DB Proxy",
  description: "Changes the settings for an existing DB proxy.",
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
          description: "The identifier for the DBProxy to modify.",
          type: "string",
          required: true,
        },
        NewDBProxyName: {
          name: "New DB Proxy Name",
          description: "The new identifier for the DBProxy.",
          type: "string",
          required: false,
        },
        Auth: {
          name: "Auth",
          description: "The new authentication settings for the DBProxy.",
          type: {
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
          required: false,
        },
        RequireTLS: {
          name: "Require TLS",
          description:
            "Whether Transport Layer Security (TLS) encryption is required for connections to the proxy.",
          type: "boolean",
          required: false,
        },
        IdleClientTimeout: {
          name: "Idle Client Timeout",
          description:
            "The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it.",
          type: "number",
          required: false,
        },
        DebugLogging: {
          name: "Debug Logging",
          description:
            "Whether the proxy includes detailed information about SQL statements in its logs.",
          type: "boolean",
          required: false,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role that the proxy uses to access secrets in Amazon Web Services Secrets Manager.",
          type: "string",
          required: false,
        },
        SecurityGroups: {
          name: "Security Groups",
          description: "The new list of security groups for the DBProxy.",
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

        const command = new ModifyDBProxyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Proxy Result",
      description: "Result from ModifyDBProxy operation",
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
              "The DBProxy object representing the new settings for the proxy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBProxy;
