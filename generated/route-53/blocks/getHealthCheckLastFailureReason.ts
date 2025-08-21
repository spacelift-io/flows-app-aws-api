import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetHealthCheckLastFailureReasonCommand,
} from "@aws-sdk/client-route-53";

const getHealthCheckLastFailureReason: AppBlock = {
  name: "Get Health Check Last Failure Reason",
  description:
    "Gets the reason that a specified health check failed most recently.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HealthCheckId: {
          name: "Health Check Id",
          description:
            "The ID for the health check for which you want the last failure reason.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new GetHealthCheckLastFailureReasonCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Health Check Last Failure Reason Result",
      description: "Result from GetHealthCheckLastFailureReason operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HealthCheckObservations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Region: {
                  type: "string",
                },
                IPAddress: {
                  type: "string",
                },
                StatusReport: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    CheckedTime: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "A list that contains one Observation element for each Amazon Route 53 health checker that is reporting a last failure reason.",
          },
        },
        required: ["HealthCheckObservations"],
      },
    },
  },
};

export default getHealthCheckLastFailureReason;
