import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateSpotDatafeedSubscriptionCommand,
} from "@aws-sdk/client-ec2";

const createSpotDatafeedSubscription: AppBlock = {
  name: "Create Spot Datafeed Subscription",
  description:
    "Creates a data feed for Spot Instances, enabling you to view Spot Instance usage logs.",
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
        Bucket: {
          name: "Bucket",
          description:
            "The name of the Amazon S3 bucket in which to store the Spot Instance data feed.",
          type: "string",
          required: true,
        },
        Prefix: {
          name: "Prefix",
          description: "The prefix for the data feed file names.",
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

        const command = new CreateSpotDatafeedSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Spot Datafeed Subscription Result",
      description: "Result from CreateSpotDatafeedSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SpotDatafeedSubscription: {
            type: "object",
            properties: {
              Bucket: {
                type: "string",
              },
              Fault: {
                type: "object",
                properties: {
                  Code: {
                    type: "string",
                  },
                  Message: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              OwnerId: {
                type: "string",
              },
              Prefix: {
                type: "string",
              },
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The Spot Instance data feed subscription.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSpotDatafeedSubscription;
