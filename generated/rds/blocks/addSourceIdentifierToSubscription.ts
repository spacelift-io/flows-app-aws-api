import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  AddSourceIdentifierToSubscriptionCommand,
} from "@aws-sdk/client-rds";

const addSourceIdentifierToSubscription: AppBlock = {
  name: "Add Source Identifier To Subscription",
  description:
    "Adds a source identifier to an existing RDS event notification subscription.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubscriptionName: {
          name: "Subscription Name",
          description:
            "The name of the RDS event notification subscription you want to add a source identifier to.",
          type: "string",
          required: true,
        },
        SourceIdentifier: {
          name: "Source Identifier",
          description: "The identifier of the event source to be added.",
          type: "string",
          required: true,
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

        const command = new AddSourceIdentifierToSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Source Identifier To Subscription Result",
      description: "Result from AddSourceIdentifierToSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventSubscription: {
            type: "object",
            properties: {
              CustomerAwsId: {
                type: "string",
              },
              CustSubscriptionId: {
                type: "string",
              },
              SnsTopicArn: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubscriptionCreationTime: {
                type: "string",
              },
              SourceType: {
                type: "string",
              },
              SourceIdsList: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              EventCategoriesList: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Enabled: {
                type: "boolean",
              },
              EventSubscriptionArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the results of a successful invocation of the DescribeEventSubscriptions action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default addSourceIdentifierToSubscription;
