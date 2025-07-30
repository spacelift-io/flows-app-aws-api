import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  ModifyDBProxyTargetGroupCommand,
} from "@aws-sdk/client-rds";

const modifyDBProxyTargetGroup: AppBlock = {
  name: "Modify DB Proxy Target Group",
  description: "Modifies the properties of a DBProxyTargetGroup.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TargetGroupName: {
          name: "Target Group Name",
          description: "The name of the target group to modify.",
          type: "string",
          required: true,
        },
        DBProxyName: {
          name: "DB Proxy Name",
          description: "The name of the proxy.",
          type: "string",
          required: true,
        },
        ConnectionPoolConfig: {
          name: "Connection Pool Config",
          description:
            "The settings that determine the size and behavior of the connection pool for the target group.",
          type: {
            type: "object",
            properties: {
              MaxConnectionsPercent: {
                type: "number",
              },
              MaxIdleConnectionsPercent: {
                type: "number",
              },
              ConnectionBorrowTimeout: {
                type: "number",
              },
              SessionPinningFilters: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              InitQuery: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        NewName: {
          name: "New Name",
          description: "The new name for the modified DBProxyTarget.",
          type: "string",
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

        const command = new ModifyDBProxyTargetGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Proxy Target Group Result",
      description: "Result from ModifyDBProxyTargetGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxyTargetGroup: {
            type: "object",
            properties: {
              DBProxyName: {
                type: "string",
              },
              TargetGroupName: {
                type: "string",
              },
              TargetGroupArn: {
                type: "string",
              },
              IsDefault: {
                type: "boolean",
              },
              Status: {
                type: "string",
              },
              ConnectionPoolConfig: {
                type: "object",
                properties: {
                  MaxConnectionsPercent: {
                    type: "number",
                  },
                  MaxIdleConnectionsPercent: {
                    type: "number",
                  },
                  ConnectionBorrowTimeout: {
                    type: "number",
                  },
                  SessionPinningFilters: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  InitQuery: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              CreatedDate: {
                type: "string",
              },
              UpdatedDate: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The settings of the modified DBProxyTarget.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBProxyTargetGroup;
