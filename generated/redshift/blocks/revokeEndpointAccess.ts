import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  RevokeEndpointAccessCommand,
} from "@aws-sdk/client-redshift";

const revokeEndpointAccess: AppBlock = {
  name: "Revoke Endpoint Access",
  description: `Revokes access to a cluster.`,
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
          description: "The cluster to revoke access from.",
          type: "string",
          required: false,
        },
        Account: {
          name: "Account",
          description:
            "The Amazon Web Services account ID whose access is to be revoked.",
          type: "string",
          required: false,
        },
        VpcIds: {
          name: "Vpc Ids",
          description:
            "The virtual private cloud (VPC) identifiers for which access is to be revoked.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Force: {
          name: "Force",
          description: "Indicates whether to force the revoke action.",
          type: "boolean",
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

        const command = new RevokeEndpointAccessCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Revoke Endpoint Access Result",
      description: "Result from RevokeEndpointAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Grantor: {
            type: "string",
            description:
              "The Amazon Web Services account ID of the cluster owner.",
          },
          Grantee: {
            type: "string",
            description:
              "The Amazon Web Services account ID of the grantee of the cluster.",
          },
          ClusterIdentifier: {
            type: "string",
            description: "The cluster identifier.",
          },
          AuthorizeTime: {
            type: "string",
            description: "The time (UTC) when the authorization was created.",
          },
          ClusterStatus: {
            type: "string",
            description: "The status of the cluster.",
          },
          Status: {
            type: "string",
            description: "The status of the authorization action.",
          },
          AllowedAllVPCs: {
            type: "boolean",
            description:
              "Indicates whether all VPCs in the grantee account are allowed access to the cluster.",
          },
          AllowedVPCs: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The VPCs allowed access to the cluster.",
          },
          EndpointCount: {
            type: "number",
            description:
              "The number of Redshift-managed VPC endpoints created for the authorization.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default revokeEndpointAccess;
