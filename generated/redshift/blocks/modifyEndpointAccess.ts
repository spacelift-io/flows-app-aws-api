import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyEndpointAccessCommand,
} from "@aws-sdk/client-redshift";

const modifyEndpointAccess: AppBlock = {
  name: "Modify Endpoint Access",
  description: `Modifies a Redshift-managed VPC endpoint.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EndpointName: {
          name: "Endpoint Name",
          description: "The endpoint to be modified.",
          type: "string",
          required: true,
        },
        VpcSecurityGroupIds: {
          name: "Vpc Security Group Ids",
          description:
            "The complete list of VPC security groups associated with the endpoint after the endpoint is modified.",
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

        const command = new ModifyEndpointAccessCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Endpoint Access Result",
      description: "Result from ModifyEndpointAccess operation",
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

export default modifyEndpointAccess;
