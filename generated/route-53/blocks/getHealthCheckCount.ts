import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetHealthCheckCountCommand,
} from "@aws-sdk/client-route-53";

const getHealthCheckCount: AppBlock = {
  name: "Get Health Check Count",
  description:
    "Retrieves the number of health checks that are associated with the current Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new GetHealthCheckCountCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Health Check Count Result",
      description: "Result from GetHealthCheckCount operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HealthCheckCount: {
            type: "number",
            description:
              "The number of health checks associated with the current Amazon Web Services account.",
          },
        },
        required: ["HealthCheckCount"],
      },
    },
  },
};

export default getHealthCheckCount;
