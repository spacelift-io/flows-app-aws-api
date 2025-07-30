import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcEndpointAssociationsCommand,
} from "@aws-sdk/client-ec2";

const describeVpcEndpointAssociations: AppBlock = {
  name: "Describe Vpc Endpoint Associations",
  description:
    "Describes the VPC resources, VPC endpoint services, Amazon Lattice services, or service networks associated with the VPC endpoint.",
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
        VpcEndpointIds: {
          name: "Vpc Endpoint Ids",
          description: "The IDs of the VPC endpoints.",
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
          description: "The maximum page size.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The pagination token.",
          type: "string",
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

        const command = new DescribeVpcEndpointAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Endpoint Associations Result",
      description: "Result from DescribeVpcEndpointAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcEndpointAssociations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                VpcEndpointId: {
                  type: "string",
                },
                ServiceNetworkArn: {
                  type: "string",
                },
                ServiceNetworkName: {
                  type: "string",
                },
                AssociatedResourceAccessibility: {
                  type: "string",
                },
                FailureReason: {
                  type: "string",
                },
                FailureCode: {
                  type: "string",
                },
                DnsEntry: {
                  type: "object",
                  properties: {
                    DnsName: {
                      type: "string",
                    },
                    HostedZoneId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                PrivateDnsEntry: {
                  type: "object",
                  properties: {
                    DnsName: {
                      type: "string",
                    },
                    HostedZoneId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                AssociatedResourceArn: {
                  type: "string",
                },
                ResourceConfigurationGroupArn: {
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
            description: "Details of the endpoint associations.",
          },
          NextToken: {
            type: "string",
            description: "The pagination token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcEndpointAssociations;
