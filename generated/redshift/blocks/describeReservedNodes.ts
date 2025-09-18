import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeReservedNodesCommand,
} from "@aws-sdk/client-redshift";

const describeReservedNodes: AppBlock = {
  name: "Describe Reserved Nodes",
  description: `Returns the descriptions of the reserved nodes.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedNodeId: {
          name: "Reserved Node Id",
          description: "Identifier for the node reservation.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional parameter that specifies the starting point to return a set of response records.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeReservedNodesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved Nodes Result",
      description: "Result from DescribeReservedNodes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          ReservedNodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservedNodeId: {
                  type: "string",
                },
                ReservedNodeOfferingId: {
                  type: "string",
                },
                NodeType: {
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
                NodeCount: {
                  type: "number",
                },
                State: {
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
                ReservedNodeOfferingType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of ReservedNode objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedNodes;
