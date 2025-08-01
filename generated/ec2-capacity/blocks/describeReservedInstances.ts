import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeReservedInstancesCommand,
} from "@aws-sdk/client-ec2";

const describeReservedInstances: AppBlock = {
  name: "Describe Reserved Instances",
  description:
    "Describes one or more of the Reserved Instances that you purchased.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OfferingClass: {
          name: "Offering Class",
          description:
            "Describes whether the Reserved Instance is Standard or Convertible.",
          type: "string",
          required: false,
        },
        ReservedInstancesIds: {
          name: "Reserved Instances Ids",
          description: "One or more Reserved Instance IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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
        OfferingType: {
          name: "Offering Type",
          description: "The Reserved Instance offering type.",
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

        const command = new DescribeReservedInstancesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved Instances Result",
      description: "Result from DescribeReservedInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedInstances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CurrencyCode: {
                  type: "string",
                },
                InstanceTenancy: {
                  type: "string",
                },
                OfferingClass: {
                  type: "string",
                },
                OfferingType: {
                  type: "string",
                },
                RecurringCharges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Amount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Frequency: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Scope: {
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
                AvailabilityZoneId: {
                  type: "string",
                },
                ReservedInstancesId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                Start: {
                  type: "string",
                },
                End: {
                  type: "string",
                },
                Duration: {
                  type: "number",
                },
                UsagePrice: {
                  type: "number",
                },
                FixedPrice: {
                  type: "number",
                },
                InstanceCount: {
                  type: "number",
                },
                ProductDescription: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of Reserved Instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedInstances;
