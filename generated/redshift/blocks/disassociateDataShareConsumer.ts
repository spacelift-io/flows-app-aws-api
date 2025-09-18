import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DisassociateDataShareConsumerCommand,
} from "@aws-sdk/client-redshift";

const disassociateDataShareConsumer: AppBlock = {
  name: "Disassociate Data Share Consumer",
  description: `From a datashare consumer account, remove association for the specified datashare.`,
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
            "The Amazon Resource Name (ARN) of the datashare to remove association for.",
          type: "string",
          required: true,
        },
        DisassociateEntireAccount: {
          name: "Disassociate Entire Account",
          description:
            "A value that specifies whether association for the datashare is removed from the entire account.",
          type: "boolean",
          required: false,
        },
        ConsumerArn: {
          name: "Consumer Arn",
          description:
            "The Amazon Resource Name (ARN) of the consumer namespace that association for the datashare is removed from.",
          type: "string",
          required: false,
        },
        ConsumerRegion: {
          name: "Consumer Region",
          description:
            "From a datashare consumer account, removes association of a datashare from all the existing and future namespaces in the specified Amazon Web Services Region.",
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

        const command = new DisassociateDataShareConsumerCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Data Share Consumer Result",
      description: "Result from DisassociateDataShareConsumer operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DataShareArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the datashare that the consumer is to use.",
          },
          ProducerArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the producer namespace.",
          },
          AllowPubliclyAccessibleConsumers: {
            type: "boolean",
            description:
              "A value that specifies whether the datashare can be shared to a publicly accessible cluster.",
          },
          DataShareAssociations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ConsumerIdentifier: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                ConsumerRegion: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                StatusChangeDate: {
                  type: "string",
                },
                ProducerAllowedWrites: {
                  type: "boolean",
                },
                ConsumerAcceptedWrites: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description:
              "A value that specifies when the datashare has an association between producer and data consumers.",
          },
          ManagedBy: {
            type: "string",
            description:
              "The identifier of a datashare to show its managing entity.",
          },
          DataShareType: {
            type: "string",
            description:
              "The type of the datashare created by RegisterNamespace.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateDataShareConsumer;
