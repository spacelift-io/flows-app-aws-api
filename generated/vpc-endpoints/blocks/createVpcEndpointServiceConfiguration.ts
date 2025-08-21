import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateVpcEndpointServiceConfigurationCommand,
} from "@aws-sdk/client-ec2";

const createVpcEndpointServiceConfiguration: AppBlock = {
  name: "Create Vpc Endpoint Service Configuration",
  description:
    "Creates a VPC endpoint service to which service consumers (Amazon Web Services accounts, users, and IAM roles) can connect.",
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
        AcceptanceRequired: {
          name: "Acceptance Required",
          description:
            "Indicates whether requests from service consumers to create an endpoint to your service must be accepted manually.",
          type: "boolean",
          required: false,
        },
        PrivateDnsName: {
          name: "Private Dns Name",
          description:
            "(Interface endpoint configuration) The private DNS name to assign to the VPC endpoint service.",
          type: "string",
          required: false,
        },
        NetworkLoadBalancerArns: {
          name: "Network Load Balancer Arns",
          description:
            "The Amazon Resource Names (ARNs) of the Network Load Balancers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        GatewayLoadBalancerArns: {
          name: "Gateway Load Balancer Arns",
          description:
            "The Amazon Resource Names (ARNs) of the Gateway Load Balancers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SupportedIpAddressTypes: {
          name: "Supported Ip Address Types",
          description: "The supported IP address types.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SupportedRegions: {
          name: "Supported Regions",
          description:
            "The Regions from which service consumers can access the service.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to associate with the service.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
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

        const command = new CreateVpcEndpointServiceConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Vpc Endpoint Service Configuration Result",
      description:
        "Result from CreateVpcEndpointServiceConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServiceConfiguration: {
            type: "object",
            properties: {
              ServiceType: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ServiceType: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ServiceId: {
                type: "string",
              },
              ServiceName: {
                type: "string",
              },
              ServiceState: {
                type: "string",
              },
              AvailabilityZones: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              AcceptanceRequired: {
                type: "boolean",
              },
              ManagesVpcEndpoints: {
                type: "boolean",
              },
              NetworkLoadBalancerArns: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              GatewayLoadBalancerArns: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              SupportedIpAddressTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              BaseEndpointDnsNames: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              PrivateDnsName: {
                type: "string",
              },
              PrivateDnsNameConfiguration: {
                type: "object",
                properties: {
                  State: {
                    type: "string",
                  },
                  Type: {
                    type: "string",
                  },
                  Value: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              PayerResponsibility: {
                type: "string",
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
              SupportedRegions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Region: {
                      type: "string",
                    },
                    ServiceState: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              RemoteAccessEnabled: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description: "Information about the service configuration.",
          },
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createVpcEndpointServiceConfiguration;
