import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBProxyTargetGroupsCommand,
} from "@aws-sdk/client-rds";

const describeDBProxyTargetGroups: AppBlock = {
  name: "Describe DB Proxy Target Groups",
  description:
    "Returns information about DB proxy target groups, represented by DBProxyTargetGroup data structures.",
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
          description:
            "The identifier of the DBProxy associated with the target group.",
          type: "string",
          required: true,
        },
        TargetGroupName: {
          name: "Target Group Name",
          description: "The identifier of the DBProxyTargetGroup to describe.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeDBProxyTargetGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Proxy Target Groups Result",
      description: "Result from DescribeDBProxyTargetGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TargetGroups: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
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
            },
            description:
              "An arbitrary number of DBProxyTargetGroup objects, containing details of the corresponding target groups.",
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

export default describeDBProxyTargetGroups;
