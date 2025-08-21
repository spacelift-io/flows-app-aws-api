import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  RegisterDefaultPatchBaselineCommand,
} from "@aws-sdk/client-ssm";

const registerDefaultPatchBaseline: AppBlock = {
  name: "Register Default Patch Baseline",
  description:
    "Defines the default patch baseline for the relevant operating system.",
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
          description:
            "The ID of the patch baseline that should be the default patch baseline.",
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

        const command = new RegisterDefaultPatchBaselineCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Default Patch Baseline Result",
      description: "Result from RegisterDefaultPatchBaseline operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description: "The ID of the default patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerDefaultPatchBaseline;
