import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteInstanceConnectEndpointCommand,
} from "@aws-sdk/client-ec2";

const deleteInstanceConnectEndpoint: AppBlock = {
  name: "Delete Instance Connect Endpoint",
  description: "Deletes the specified EC2 Instance Connect Endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InstanceConnectEndpointId: {
          name: "Instance Connect Endpoint Id",
          description: "The ID of the EC2 Instance Connect Endpoint to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DeleteInstanceConnectEndpointCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Instance Connect Endpoint Result",
      description: "Result from DeleteInstanceConnectEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceConnectEndpoint: {
            type: "object",
            properties: {
              OwnerId: {
                type: "string",
              },
              InstanceConnectEndpointId: {
                type: "string",
              },
              InstanceConnectEndpointArn: {
                type: "string",
              },
              State: {
                type: "string",
              },
              StateMessage: {
                type: "string",
              },
              DnsName: {
                type: "string",
              },
              FipsDnsName: {
                type: "string",
              },
              NetworkInterfaceIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              VpcId: {
                type: "string",
              },
              AvailabilityZone: {
                type: "string",
              },
              CreatedAt: {
                type: "string",
              },
              SubnetId: {
                type: "string",
              },
              PreserveClientIp: {
                type: "boolean",
              },
              SecurityGroupIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              IpAddressType: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the EC2 Instance Connect Endpoint.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteInstanceConnectEndpoint;
