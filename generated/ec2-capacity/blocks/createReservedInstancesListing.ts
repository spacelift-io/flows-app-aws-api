import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateReservedInstancesListingCommand,
} from "@aws-sdk/client-ec2";

const createReservedInstancesListing: AppBlock = {
  name: "Create Reserved Instances Listing",
  description:
    "Creates a listing for Amazon EC2 Standard Reserved Instances to be sold in the Reserved Instance Marketplace.",
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
          description: "The ID of the active Standard Reserved Instance.",
          type: "string",
          required: true,
        },
        InstanceCount: {
          name: "Instance Count",
          description:
            "The number of instances that are a part of a Reserved Instance account to be listed in the Reserved Instance Marketplace.",
          type: "number",
          required: true,
        },
        PriceSchedules: {
          name: "Price Schedules",
          description:
            "A list specifying the price of the Standard Reserved Instance for each month remaining in the Reserved Instance term.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Term: {
                  type: "number",
                },
                Price: {
                  type: "number",
                },
                CurrencyCode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier you provide to ensure idempotency of your listings.",
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

        const command = new CreateReservedInstancesListingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Reserved Instances Listing Result",
      description: "Result from CreateReservedInstancesListing operation",
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
            description:
              "Information about the Standard Reserved Instance listing.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createReservedInstancesListing;
