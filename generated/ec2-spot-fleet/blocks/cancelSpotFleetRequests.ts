import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CancelSpotFleetRequestsCommand } from "@aws-sdk/client-ec2";

const cancelSpotFleetRequests: AppBlock = {
  name: "Cancel Spot Fleet Requests",
  description: "Cancels the specified Spot Fleet requests.",
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
        SpotFleetRequestIds: {
          name: "Spot Fleet Request Ids",
          description: "The IDs of the Spot Fleet requests.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        TerminateInstances: {
          name: "Terminate Instances",
          description:
            "Indicates whether to terminate the associated instances when the Spot Fleet request is canceled.",
          type: "boolean",
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

        const command = new CancelSpotFleetRequestsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Spot Fleet Requests Result",
      description: "Result from CancelSpotFleetRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfulFleetRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CurrentSpotFleetRequestState: {
                  type: "string",
                },
                PreviousSpotFleetRequestState: {
                  type: "string",
                },
                SpotFleetRequestId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the Spot Fleet requests that are successfully canceled.",
          },
          UnsuccessfulFleetRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
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
                SpotFleetRequestId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the Spot Fleet requests that are not successfully canceled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelSpotFleetRequests;
