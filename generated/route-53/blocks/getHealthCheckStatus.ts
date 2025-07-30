import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetHealthCheckStatusCommand,
} from "@aws-sdk/client-route-53";

const getHealthCheckStatus: AppBlock = {
  name: "Get Health Check Status",
  description: "Gets status of a specified health check.",
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
            "The ID for the health check that you want the current status for.",
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
        });

        const command = new GetHealthCheckStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Health Check Status Result",
      description: "Result from GetHealthCheckStatus operation",
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
              "A list that contains one HealthCheckObservation element for each Amazon Route 53 health checker that is reporting a status about the health check endpoint.",
          },
        },
        required: ["HealthCheckObservations"],
      },
    },
  },
};

export default getHealthCheckStatus;
