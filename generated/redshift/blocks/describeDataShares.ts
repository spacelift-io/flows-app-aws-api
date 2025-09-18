import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeDataSharesCommand,
} from "@aws-sdk/client-redshift";

const describeDataShares: AppBlock = {
  name: "Describe Data Shares",
  description: `Shows the status of any inbound or outbound datashares available in the specified account.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DataShareArn: {
          name: "Data Share Arn",
          description:
            "The Amazon resource name (ARN) of the datashare to describe details of.",
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

        const command = new DescribeDataSharesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Data Shares Result",
      description: "Result from DescribeDataShares operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DataShares: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DataShareArn: {
                  type: "string",
                },
                ProducerArn: {
                  type: "string",
                },
                AllowPubliclyAccessibleConsumers: {
                  type: "boolean",
                },
                DataShareAssociations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ConsumerIdentifier: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ConsumerRegion: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CreatedDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StatusChangeDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProducerAllowedWrites: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ConsumerAcceptedWrites: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ManagedBy: {
                  type: "string",
                },
                DataShareType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The results returned from describing datashares.",
          },
          Marker: {
            type: "string",
            description:
              "An optional parameter that specifies the starting point to return a set of response records.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDataShares;
