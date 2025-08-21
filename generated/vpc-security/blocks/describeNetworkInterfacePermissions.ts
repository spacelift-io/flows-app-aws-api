import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeNetworkInterfacePermissionsCommand,
} from "@aws-sdk/client-ec2";

const describeNetworkInterfacePermissions: AppBlock = {
  name: "Describe Network Interface Permissions",
  description: "Describes the permissions for your network interfaces.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NetworkInterfacePermissionIds: {
          name: "Network Interface Permission Ids",
          description: "The network interface permission IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
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
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
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

        const command = new DescribeNetworkInterfacePermissionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Network Interface Permissions Result",
      description: "Result from DescribeNetworkInterfacePermissions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NetworkInterfacePermissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                NetworkInterfacePermissionId: {
                  type: "string",
                },
                NetworkInterfaceId: {
                  type: "string",
                },
                AwsAccountId: {
                  type: "string",
                },
                AwsService: {
                  type: "string",
                },
                Permission: {
                  type: "string",
                },
                PermissionState: {
                  type: "object",
                  properties: {
                    State: {
                      type: "string",
                    },
                    StatusMessage: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "The network interface permissions.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeNetworkInterfacePermissions;
