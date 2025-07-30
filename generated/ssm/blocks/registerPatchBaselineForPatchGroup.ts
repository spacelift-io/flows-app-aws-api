import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  RegisterPatchBaselineForPatchGroupCommand,
} from "@aws-sdk/client-ssm";

const registerPatchBaselineForPatchGroup: AppBlock = {
  name: "Register Patch Baseline For Patch Group",
  description: "Registers a patch baseline for a patch group.",
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
            "The ID of the patch baseline to register with the patch group.",
          type: "string",
          required: true,
        },
        PatchGroup: {
          name: "Patch Group",
          description:
            "The name of the patch group to be registered with the patch baseline.",
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

        const command = new RegisterPatchBaselineForPatchGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Patch Baseline For Patch Group Result",
      description: "Result from RegisterPatchBaselineForPatchGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description:
              "The ID of the patch baseline the patch group was registered with.",
          },
          PatchGroup: {
            type: "string",
            description:
              "The name of the patch group registered with the patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerPatchBaselineForPatchGroup;
