import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeletePatchBaselineCommand } from "@aws-sdk/client-ssm";

const deletePatchBaseline: AppBlock = {
  name: "Delete Patch Baseline",
  description: "Deletes a patch baseline.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BaselineId: {
          name: "Baseline Id",
          description: "The ID of the patch baseline to delete.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeletePatchBaselineCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Patch Baseline Result",
      description: "Result from DeletePatchBaseline operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description: "The ID of the deleted patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deletePatchBaseline;
