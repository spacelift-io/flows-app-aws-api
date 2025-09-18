import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateEndpointAccessCommand,
} from "@aws-sdk/client-redshift";

const createEndpointAccess: AppBlock = {
  name: "Create Endpoint Access",
  description: `Creates a Redshift-managed VPC endpoint.`,
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
        ResourceOwner: {
          name: "Resource Owner",
          description:
            "The Amazon Web Services account ID of the owner of the cluster.",
          type: "string",
          required: false,
        },
        EndpointName: {
          name: "Endpoint Name",
          description: "The Redshift-managed VPC endpoint name.",
          type: "string",
          required: true,
        },
        SubnetGroupName: {
          name: "Subnet Group Name",
          description:
            "The subnet group from which Amazon Redshift chooses the subnet to deploy the endpoint.",
          type: "string",
          required: true,
        },
        VpcSecurityGroupIds: {
          name: "Vpc Security Group Ids",
          description:
            "The security group that defines the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.",
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

        const command = new CreateEndpointAccessCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Endpoint Access Result",
      description: "Result from CreateEndpointAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClusterIdentifier: {
            type: "string",
            description:
              "The cluster identifier of the cluster associated with the endpoint.",
          },
          ResourceOwner: {
            type: "string",
            description:
              "The Amazon Web Services account ID of the owner of the cluster.",
          },
          SubnetGroupName: {
            type: "string",
            description:
              "The subnet group name where Amazon Redshift chooses to deploy the endpoint.",
          },
          EndpointStatus: {
            type: "string",
            description: "The status of the endpoint.",
          },
          EndpointName: {
            type: "string",
            description: "The name of the endpoint.",
          },
          EndpointCreateTime: {
            type: "string",
            description: "The time (UTC) that the endpoint was created.",
          },
          Port: {
            type: "number",
            description:
              "The port number on which the cluster accepts incoming connections.",
          },
          Address: {
            type: "string",
            description: "The DNS address of the endpoint.",
          },
          VpcSecurityGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                VpcSecurityGroupId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The security groups associated with the endpoint.",
          },
          VpcEndpoint: {
            type: "object",
            properties: {
              VpcEndpointId: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              NetworkInterfaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    NetworkInterfaceId: {
                      type: "string",
                    },
                    SubnetId: {
                      type: "string",
                    },
                    PrivateIpAddress: {
                      type: "string",
                    },
                    AvailabilityZone: {
                      type: "string",
                    },
                    Ipv6Address: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "The connection endpoint for connecting to an Amazon Redshift cluster through the proxy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createEndpointAccess;
