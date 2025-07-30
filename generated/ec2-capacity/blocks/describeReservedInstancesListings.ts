import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeReservedInstancesListingsCommand,
} from "@aws-sdk/client-ec2";

const describeReservedInstancesListings: AppBlock = {
  name: "Describe Reserved Instances Listings",
  description:
    "Describes your account's Reserved Instance listings in the Reserved Instance Marketplace.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedInstancesId: {
          name: "Reserved Instances Id",
          description: "One or more Reserved Instance IDs.",
          type: "string",
          required: false,
        },
        ReservedInstancesListingId: {
          name: "Reserved Instances Listing Id",
          description: "One or more Reserved Instance listing IDs.",
          type: "string",
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

        const command = new DescribeReservedInstancesListingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved Instances Listings Result",
      description: "Result from DescribeReservedInstancesListings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedInstancesListings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClientToken: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                InstanceCounts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      InstanceCount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                PriceSchedules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Active: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CurrencyCode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Price: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Term: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReservedInstancesId: {
                  type: "string",
                },
                ReservedInstancesListingId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
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
                UpdateDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Reserved Instance listing.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedInstancesListings;
