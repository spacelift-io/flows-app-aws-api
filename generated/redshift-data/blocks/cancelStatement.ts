import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftDataClient,
  CancelStatementCommand,
} from "@aws-sdk/client-redshift-data";

const cancelStatement: AppBlock = {
  name: "Cancel Statement",
  description: `Cancels a running query.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The identifier of the SQL statement to cancel.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftDataClient({
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

        const command = new CancelStatementCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Statement Result",
      description: "Result from CancelStatement operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description:
              "A value that indicates whether the cancel statement succeeded (true).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelStatement;
