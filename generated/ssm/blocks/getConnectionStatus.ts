import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetConnectionStatusCommand } from "@aws-sdk/client-ssm";

const getConnectionStatus: AppBlock = {
  name: "Get Connection Status",
  description:
    "Retrieves the Session Manager connection status for a managed node to determine whether it is running and ready to receive Session Manager connections.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Target: {
          name: "Target",
          description: "The managed node ID.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetConnectionStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Connection Status Result",
      description: "Result from GetConnectionStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Target: {
            type: "string",
            description:
              "The ID of the managed node to check connection status.",
          },
          Status: {
            type: "string",
            description: "The status of the connection to the managed node.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getConnectionStatus;
