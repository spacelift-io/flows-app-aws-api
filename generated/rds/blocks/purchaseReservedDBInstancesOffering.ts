import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  PurchaseReservedDBInstancesOfferingCommand,
} from "@aws-sdk/client-rds";

const purchaseReservedDBInstancesOffering: AppBlock = {
  name: "Purchase Reserved DB Instances Offering",
  description: "Purchases a reserved DB instance offering.",
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
          description:
            "The ID of the Reserved DB instance offering to purchase.",
          type: "string",
          required: true,
        },
        ReservedDBInstanceId: {
          name: "Reserved DB Instance Id",
          description:
            "Customer-specified identifier to track this reservation.",
          type: "string",
          required: false,
        },
        DBInstanceCount: {
          name: "DB Instance Count",
          description: "The number of instances to reserve.",
          type: "number",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags.",
          type: {
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

        const command = new PurchaseReservedDBInstancesOfferingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Reserved DB Instances Offering Result",
      description: "Result from PurchaseReservedDBInstancesOffering operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedDBInstance: {
            type: "object",
            properties: {
              ReservedDBInstanceId: {
                type: "string",
              },
              ReservedDBInstancesOfferingId: {
                type: "string",
              },
              DBInstanceClass: {
                type: "string",
              },
              StartTime: {
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
              DBInstanceCount: {
                type: "number",
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
              State: {
                type: "string",
              },
              RecurringCharges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RecurringChargeAmount: {
                      type: "number",
                    },
                    RecurringChargeFrequency: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ReservedDBInstanceArn: {
                type: "string",
              },
              LeaseId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "This data type is used as a response element in the DescribeReservedDBInstances and PurchaseReservedDBInstancesOffering actions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseReservedDBInstancesOffering;
