import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTransitGatewayPeeringAttachmentsCommand,
} from "@aws-sdk/client-ec2";

const describeTransitGatewayPeeringAttachments: AppBlock = {
  name: "Describe Transit Gateway Peering Attachments",
  description: "Describes your transit gateway peering attachments.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentIds: {
          name: "Transit Gateway Attachment Ids",
          description:
            "One or more IDs of the transit gateway peering attachments.",
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

        const command = new DescribeTransitGatewayPeeringAttachmentsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateway Peering Attachments Result",
      description:
        "Result from DescribeTransitGatewayPeeringAttachments operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPeeringAttachments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TransitGatewayAttachmentId: {
                  type: "string",
                },
                AccepterTransitGatewayAttachmentId: {
                  type: "string",
                },
                RequesterTgwInfo: {
                  type: "object",
                  properties: {
                    TransitGatewayId: {
                      type: "string",
                    },
                    CoreNetworkId: {
                      type: "string",
                    },
                    OwnerId: {
                      type: "string",
                    },
                    Region: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                AccepterTgwInfo: {
                  type: "object",
                  properties: {
                    TransitGatewayId: {
                      type: "string",
                    },
                    CoreNetworkId: {
                      type: "string",
                    },
                    OwnerId: {
                      type: "string",
                    },
                    Region: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Options: {
                  type: "object",
                  properties: {
                    DynamicRouting: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Status: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
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
            description: "The transit gateway peering attachments.",
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

export default describeTransitGatewayPeeringAttachments;
