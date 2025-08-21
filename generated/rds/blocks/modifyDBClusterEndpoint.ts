import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBClusterEndpointCommand } from "@aws-sdk/client-rds";

const modifyDBClusterEndpoint: AppBlock = {
  name: "Modify DB Cluster Endpoint",
  description:
    "Modifies the properties of an endpoint in an Amazon Aurora DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterEndpointIdentifier: {
          name: "DB Cluster Endpoint Identifier",
          description: "The identifier of the endpoint to modify.",
          type: "string",
          required: true,
        },
        EndpointType: {
          name: "Endpoint Type",
          description: "The type of the endpoint.",
          type: "string",
          required: false,
        },
        StaticMembers: {
          name: "Static Members",
          description:
            "List of DB instance identifiers that are part of the custom endpoint group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ExcludedMembers: {
          name: "Excluded Members",
          description:
            "List of DB instance identifiers that aren't part of the custom endpoint group.",
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

        const command = new ModifyDBClusterEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Cluster Endpoint Result",
      description: "Result from ModifyDBClusterEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterEndpointIdentifier: {
            type: "string",
            description: "The identifier associated with the endpoint.",
          },
          DBClusterIdentifier: {
            type: "string",
            description:
              "The DB cluster identifier of the DB cluster associated with the endpoint.",
          },
          DBClusterEndpointResourceIdentifier: {
            type: "string",
            description:
              "A unique system-generated identifier for an endpoint.",
          },
          Endpoint: {
            type: "string",
            description: "The DNS address of the endpoint.",
          },
          Status: {
            type: "string",
            description: "The current status of the endpoint.",
          },
          EndpointType: {
            type: "string",
            description: "The type of the endpoint.",
          },
          CustomEndpointType: {
            type: "string",
            description: "The type associated with a custom endpoint.",
          },
          StaticMembers: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of DB instance identifiers that are part of the custom endpoint group.",
          },
          ExcludedMembers: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of DB instance identifiers that aren't part of the custom endpoint group.",
          },
          DBClusterEndpointArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) for the endpoint.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDBClusterEndpoint;
