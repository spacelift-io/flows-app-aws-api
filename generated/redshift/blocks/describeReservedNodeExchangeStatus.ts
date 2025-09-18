import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeReservedNodeExchangeStatusCommand,
} from "@aws-sdk/client-redshift";

const describeReservedNodeExchangeStatus: AppBlock = {
  name: "Describe Reserved Node Exchange Status",
  description: `Returns exchange status details and associated metadata for a reserved-node exchange.`,
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
          description:
            "The identifier of the source reserved node in a reserved-node exchange request.",
          type: "string",
          required: false,
        },
        ReservedNodeExchangeRequestId: {
          name: "Reserved Node Exchange Request Id",
          description: "The identifier of the reserved-node exchange request.",
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
            "An optional pagination token provided by a previous DescribeReservedNodeExchangeStatus request.",
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

        const command = new DescribeReservedNodeExchangeStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved Node Exchange Status Result",
      description: "Result from DescribeReservedNodeExchangeStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedNodeExchangeStatusDetails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservedNodeExchangeRequestId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                RequestTime: {
                  type: "string",
                },
                SourceReservedNodeId: {
                  type: "string",
                },
                SourceReservedNodeType: {
                  type: "string",
                },
                SourceReservedNodeCount: {
                  type: "number",
                },
                TargetReservedNodeOfferingId: {
                  type: "string",
                },
                TargetReservedNodeType: {
                  type: "string",
                },
                TargetReservedNodeCount: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "The details of the reserved-node exchange request, including the status, request time, source reserved-node identifier, and additional details.",
          },
          Marker: {
            type: "string",
            description:
              "A pagination token provided by a previous DescribeReservedNodeExchangeStatus request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedNodeExchangeStatus;
