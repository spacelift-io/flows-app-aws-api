import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeDBProxiesCommand } from "@aws-sdk/client-rds";

const describeDBProxies: AppBlock = {
  name: "Describe DB Proxies",
  description: "Returns information about DB proxies.",
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
          description: "The name of the DB proxy.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter is not currently supported.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
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

        const command = new DescribeDBProxiesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Proxies Result",
      description: "Result from DescribeDBProxies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxies: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      UserName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AuthScheme: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SecretArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IAMAuth: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ClientPasswordAuthType: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description:
              "A return value representing an arbitrary number of DBProxy data structures.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBProxies;
