import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AcceptReservedInstancesExchangeQuoteCommand,
} from "@aws-sdk/client-ec2";

const acceptReservedInstancesExchangeQuote: AppBlock = {
  name: "Accept Reserved Instances Exchange Quote",
  description:
    "Accepts the Convertible Reserved Instance exchange quote described in the GetReservedInstancesExchangeQuote call.",
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
        ReservedInstanceIds: {
          name: "Reserved Instance Ids",
          description:
            "The IDs of the Convertible Reserved Instances to exchange for another Convertible Reserved Instance of the same or higher value.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        TargetConfigurations: {
          name: "Target Configurations",
          description:
            "The configuration of the target Convertible Reserved Instance to exchange for your current Convertible Reserved Instances.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceCount: {
                  type: "number",
                },
                OfferingId: {
                  type: "string",
                },
              },
              required: ["OfferingId"],
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

        const command = new AcceptReservedInstancesExchangeQuoteCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Accept Reserved Instances Exchange Quote Result",
      description: "Result from AcceptReservedInstancesExchangeQuote operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExchangeId: {
            type: "string",
            description: "The ID of the successful exchange.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default acceptReservedInstancesExchangeQuote;
