import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeInboundIntegrationsCommand,
} from "@aws-sdk/client-redshift";

const describeInboundIntegrations: AppBlock = {
  name: "Describe Inbound Integrations",
  description: `Returns a list of inbound integrations.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IntegrationArn: {
          name: "Integration Arn",
          description:
            "The Amazon Resource Name (ARN) of the inbound integration.",
          type: "string",
          required: false,
        },
        TargetArn: {
          name: "Target Arn",
          description:
            "The Amazon Resource Name (ARN) of the target of an inbound integration.",
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

        const command = new DescribeInboundIntegrationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Inbound Integrations Result",
      description: "Result from DescribeInboundIntegrations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          InboundIntegrations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IntegrationArn: {
                  type: "string",
                },
                SourceArn: {
                  type: "string",
                },
                TargetArn: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ErrorCode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ErrorMessage: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["ErrorCode"],
                    additionalProperties: false,
                  },
                },
                CreateTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of InboundIntegration instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInboundIntegrations;
