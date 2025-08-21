import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBClusterEndpointsCommand,
} from "@aws-sdk/client-rds";

const describeDBClusterEndpoints: AppBlock = {
  name: "Describe DB Cluster Endpoints",
  description:
    "Returns information about endpoints for an Amazon Aurora DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterIdentifier: {
          name: "DB Cluster Identifier",
          description:
            "The DB cluster identifier of the DB cluster associated with the endpoint.",
          type: "string",
          required: false,
        },
        DBClusterEndpointIdentifier: {
          name: "DB Cluster Endpoint Identifier",
          description: "The identifier of the endpoint to describe.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A set of name-value pairs that define which endpoints to include in the output.",
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
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeDBClusterEndpoints request.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeDBClusterEndpointsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Cluster Endpoints Result",
      description: "Result from DescribeDBClusterEndpoints operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeDBClusterEndpoints request.",
          },
          DBClusterEndpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBClusterEndpointIdentifier: {
                  type: "string",
                },
                DBClusterIdentifier: {
                  type: "string",
                },
                DBClusterEndpointResourceIdentifier: {
                  type: "string",
                },
                Endpoint: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                EndpointType: {
                  type: "string",
                },
                CustomEndpointType: {
                  type: "string",
                },
                StaticMembers: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ExcludedMembers: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                DBClusterEndpointArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Contains the details of the endpoints associated with the cluster and matching any filter conditions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBClusterEndpoints;
