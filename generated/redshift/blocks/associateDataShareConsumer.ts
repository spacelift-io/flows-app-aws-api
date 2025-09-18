import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  AssociateDataShareConsumerCommand,
} from "@aws-sdk/client-redshift";

const associateDataShareConsumer: AppBlock = {
  name: "Associate Data Share Consumer",
  description: `From a datashare consumer account, associates a datashare with the account (AssociateEntireAccount) or the specified namespace (ConsumerArn).`,
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
            "The Amazon Resource Name (ARN) of the datashare that the consumer is to use.",
          type: "string",
          required: true,
        },
        AssociateEntireAccount: {
          name: "Associate Entire Account",
          description:
            "A value that specifies whether the datashare is associated with the entire account.",
          type: "boolean",
          required: false,
        },
        ConsumerArn: {
          name: "Consumer Arn",
          description:
            "The Amazon Resource Name (ARN) of the consumer namespace associated with the datashare.",
          type: "string",
          required: false,
        },
        ConsumerRegion: {
          name: "Consumer Region",
          description:
            "From a datashare consumer account, associates a datashare with all existing and future namespaces in the specified Amazon Web Services Region.",
          type: "string",
          required: false,
        },
        AllowWrites: {
          name: "Allow Writes",
          description:
            "If set to true, allows write operations for a datashare.",
          type: "boolean",
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

        const command = new AssociateDataShareConsumerCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Data Share Consumer Result",
      description: "Result from AssociateDataShareConsumer operation",
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

export default associateDataShareConsumer;
