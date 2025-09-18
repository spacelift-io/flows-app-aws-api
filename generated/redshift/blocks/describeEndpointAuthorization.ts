import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeEndpointAuthorizationCommand,
} from "@aws-sdk/client-redshift";

const describeEndpointAuthorization: AppBlock = {
  name: "Describe Endpoint Authorization",
  description: `Describes an endpoint authorization.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description: "The cluster identifier of the cluster to access.",
          type: "string",
          required: false,
        },
        Account: {
          name: "Account",
          description:
            "The Amazon Web Services account ID of either the cluster owner (grantor) or grantee.",
          type: "string",
          required: false,
        },
        Grantee: {
          name: "Grantee",
          description:
            "Indicates whether to check authorization from a grantor or grantee point of view.",
          type: "boolean",
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
            "An optional pagination token provided by a previous DescribeEndpointAuthorization request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeEndpointAuthorizationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Endpoint Authorization Result",
      description: "Result from DescribeEndpointAuthorization operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EndpointAuthorizationList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Grantor: {
                  type: "string",
                },
                Grantee: {
                  type: "string",
                },
                ClusterIdentifier: {
                  type: "string",
                },
                AuthorizeTime: {
                  type: "string",
                },
                ClusterStatus: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                AllowedAllVPCs: {
                  type: "boolean",
                },
                AllowedVPCs: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                EndpointCount: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "The authorizations to an endpoint.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeEndpointAuthorization request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEndpointAuthorization;
