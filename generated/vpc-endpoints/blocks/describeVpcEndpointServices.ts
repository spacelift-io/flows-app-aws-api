import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcEndpointServicesCommand,
} from "@aws-sdk/client-ec2";

const describeVpcEndpointServices: AppBlock = {
  name: "Describe Vpc Endpoint Services",
  description:
    "Describes available services to which you can create a VPC endpoint.",
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
        ServiceNames: {
          name: "Service Names",
          description: "The service names.",
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
          description: "The filters.",
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        ServiceRegions: {
          name: "Service Regions",
          description: "The service Regions.",
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

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeVpcEndpointServicesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Endpoint Services Result",
      description: "Result from DescribeVpcEndpointServices operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServiceNames: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The supported services.",
          },
          ServiceDetails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ServiceName: {
                  type: "string",
                },
                ServiceId: {
                  type: "string",
                },
                ServiceType: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ServiceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ServiceRegion: {
                  type: "string",
                },
                AvailabilityZones: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Owner: {
                  type: "string",
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
                PrivateDnsNames: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      PrivateDnsName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                VpcEndpointPolicySupported: {
                  type: "boolean",
                },
                AcceptanceRequired: {
                  type: "boolean",
                },
                ManagesVpcEndpoints: {
                  type: "boolean",
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
                PrivateDnsNameVerificationState: {
                  type: "string",
                },
                SupportedIpAddressTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the service.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcEndpointServices;
