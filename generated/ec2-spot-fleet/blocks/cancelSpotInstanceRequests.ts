import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CancelSpotInstanceRequestsCommand,
} from "@aws-sdk/client-ec2";

const cancelSpotInstanceRequests: AppBlock = {
  name: "Cancel Spot Instance Requests",
  description: "Cancels one or more Spot Instance requests.",
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
        SpotInstanceRequestIds: {
          name: "Spot Instance Request Ids",
          description: "The IDs of the Spot Instance requests.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
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

        const command = new CancelSpotInstanceRequestsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Spot Instance Requests Result",
      description: "Result from CancelSpotInstanceRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CancelledSpotInstanceRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SpotInstanceRequestId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The Spot Instance requests.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelSpotInstanceRequests;
