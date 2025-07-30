import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteSpotDatafeedSubscriptionCommand,
} from "@aws-sdk/client-ec2";

const deleteSpotDatafeedSubscription: AppBlock = {
  name: "Delete Spot Datafeed Subscription",
  description: "Deletes the data feed for Spot Instances.",
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

        const command = new DeleteSpotDatafeedSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Spot Datafeed Subscription Result",
      description: "Result from DeleteSpotDatafeedSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSpotDatafeedSubscription;
