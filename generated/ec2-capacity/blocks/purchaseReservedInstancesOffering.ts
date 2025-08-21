import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  PurchaseReservedInstancesOfferingCommand,
} from "@aws-sdk/client-ec2";

const purchaseReservedInstancesOffering: AppBlock = {
  name: "Purchase Reserved Instances Offering",
  description: "Purchases a Reserved Instance for use with your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceCount: {
          name: "Instance Count",
          description: "The number of Reserved Instances to purchase.",
          type: "number",
          required: true,
        },
        ReservedInstancesOfferingId: {
          name: "Reserved Instances Offering Id",
          description: "The ID of the Reserved Instance offering to purchase.",
          type: "string",
          required: true,
        },
        PurchaseTime: {
          name: "Purchase Time",
          description:
            "The time at which to purchase the Reserved Instance, in UTC format (for example, YYYY-MM-DDTHH:MM:SSZ).",
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
        LimitPrice: {
          name: "Limit Price",
          description:
            "Specified for Reserved Instance Marketplace offerings to limit the total order and ensure that the Reserved Instances are not purchased at unexpected prices.",
          type: {
            type: "object",
            properties: {
              Amount: {
                type: "number",
              },
              CurrencyCode: {
                type: "string",
              },
            },
            additionalProperties: false,
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

        const command = new PurchaseReservedInstancesOfferingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Reserved Instances Offering Result",
      description: "Result from PurchaseReservedInstancesOffering operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedInstancesId: {
            type: "string",
            description: "The IDs of the purchased Reserved Instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseReservedInstancesOffering;
