import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteUsageLimitCommand,
} from "@aws-sdk/client-redshift";

const deleteUsageLimit: AppBlock = {
  name: "Delete Usage Limit",
  description: `Deletes a usage limit from a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UsageLimitId: {
          name: "Usage Limit Id",
          description: "The identifier of the usage limit to delete.",
          type: "string",
          required: true,
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

        const command = new DeleteUsageLimitCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Usage Limit Result",
      description: "Result from DeleteUsageLimit operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteUsageLimit;
