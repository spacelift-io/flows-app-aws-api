import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CancelReservedInstancesListingCommand,
} from "@aws-sdk/client-ec2";

const cancelReservedInstancesListing: AppBlock = {
  name: "Cancel Reserved Instances Listing",
  description:
    "Cancels the specified Reserved Instance listing in the Reserved Instance Marketplace.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedInstancesListingId: {
          name: "Reserved Instances Listing Id",
          description: "The ID of the Reserved Instance listing.",
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

        const command = new CancelReservedInstancesListingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Reserved Instances Listing Result",
      description: "Result from CancelReservedInstancesListing operation",
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
            description: "The Reserved Instance listing.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelReservedInstancesListing;
