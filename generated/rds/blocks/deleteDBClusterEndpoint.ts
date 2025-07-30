import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBClusterEndpointCommand } from "@aws-sdk/client-rds";

const deleteDBClusterEndpoint: AppBlock = {
  name: "Delete DB Cluster Endpoint",
  description:
    "Deletes a custom endpoint and removes it from an Amazon Aurora DB cluster.",
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
          description: "The identifier associated with the custom endpoint.",
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

        const command = new DeleteDBClusterEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Cluster Endpoint Result",
      description: "Result from DeleteDBClusterEndpoint operation",
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

export default deleteDBClusterEndpoint;
