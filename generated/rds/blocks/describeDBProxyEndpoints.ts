import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBProxyEndpointsCommand,
} from "@aws-sdk/client-rds";

const describeDBProxyEndpoints: AppBlock = {
  name: "Describe DB Proxy Endpoints",
  description: "Returns information about DB proxy endpoints.",
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
            "The name of the DB proxy whose endpoints you want to describe.",
          type: "string",
          required: false,
        },
        DBProxyEndpointName: {
          name: "DB Proxy Endpoint Name",
          description: "The name of a DB proxy endpoint to describe.",
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

        const command = new DescribeDBProxyEndpointsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Proxy Endpoints Result",
      description: "Result from DescribeDBProxyEndpoints operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxyEndpoints: {
            type: "array",
            items: {
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
            },
            description:
              "The list of ProxyEndpoint objects returned by the API operation.",
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

export default describeDBProxyEndpoints;
