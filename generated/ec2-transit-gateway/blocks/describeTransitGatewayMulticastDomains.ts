import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTransitGatewayMulticastDomainsCommand,
} from "@aws-sdk/client-ec2";

const describeTransitGatewayMulticastDomains: AppBlock = {
  name: "Describe Transit Gateway Multicast Domains",
  description: "Describes one or more transit gateway multicast domains.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayMulticastDomainIds: {
          name: "Transit Gateway Multicast Domain Ids",
          description: "The ID of the transit gateway multicast domain.",
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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

        const command = new DescribeTransitGatewayMulticastDomainsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateway Multicast Domains Result",
      description:
        "Result from DescribeTransitGatewayMulticastDomains operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayMulticastDomains: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TransitGatewayMulticastDomainId: {
                  type: "string",
                },
                TransitGatewayId: {
                  type: "string",
                },
                TransitGatewayMulticastDomainArn: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                Options: {
                  type: "object",
                  properties: {
                    Igmpv2Support: {
                      type: "string",
                    },
                    StaticSourcesSupport: {
                      type: "string",
                    },
                    AutoAcceptSharedAssociations: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                State: {
                  type: "string",
                },
                CreationTime: {
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
            description:
              "Information about the transit gateway multicast domains.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTransitGatewayMulticastDomains;
