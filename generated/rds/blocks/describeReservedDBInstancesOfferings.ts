import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeReservedDBInstancesOfferingsCommand,
} from "@aws-sdk/client-rds";

const describeReservedDBInstancesOfferings: AppBlock = {
  name: "Describe Reserved DB Instances Offerings",
  description: "Lists available reserved DB instance offerings.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedDBInstancesOfferingId: {
          name: "Reserved DB Instances Offering Id",
          description: "The offering identifier filter value.",
          type: "string",
          required: false,
        },
        DBInstanceClass: {
          name: "DB Instance Class",
          description: "The DB instance class filter value.",
          type: "string",
          required: false,
        },
        Duration: {
          name: "Duration",
          description: "Duration filter value, specified in years or seconds.",
          type: "string",
          required: false,
        },
        ProductDescription: {
          name: "Product Description",
          description: "Product description filter value.",
          type: "string",
          required: false,
        },
        OfferingType: {
          name: "Offering Type",
          description: "The offering type filter value.",
          type: "string",
          required: false,
        },
        MultiAZ: {
          name: "Multi AZ",
          description:
            "Specifies whether to show only those reservations that support Multi-AZ.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
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
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeReservedDBInstancesOfferingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved DB Instances Offerings Result",
      description: "Result from DescribeReservedDBInstancesOfferings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          ReservedDBInstancesOfferings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservedDBInstancesOfferingId: {
                  type: "string",
                },
                DBInstanceClass: {
                  type: "string",
                },
                Duration: {
                  type: "number",
                },
                FixedPrice: {
                  type: "number",
                },
                UsagePrice: {
                  type: "number",
                },
                CurrencyCode: {
                  type: "string",
                },
                ProductDescription: {
                  type: "string",
                },
                OfferingType: {
                  type: "string",
                },
                MultiAZ: {
                  type: "boolean",
                },
                RecurringCharges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      RecurringChargeAmount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RecurringChargeFrequency: {
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
            description: "A list of reserved DB instance offerings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedDBInstancesOfferings;
