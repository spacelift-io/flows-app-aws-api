import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DeregisterPatchBaselineForPatchGroupCommand,
} from "@aws-sdk/client-ssm";

const deregisterPatchBaselineForPatchGroup: AppBlock = {
  name: "Deregister Patch Baseline For Patch Group",
  description: "Removes a patch group from a patch baseline.",
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
            "The ID of the patch baseline to deregister the patch group from.",
          type: "string",
          required: true,
        },
        PatchGroup: {
          name: "Patch Group",
          description:
            "The name of the patch group that should be deregistered from the patch baseline.",
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

        const command = new DeregisterPatchBaselineForPatchGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Patch Baseline For Patch Group Result",
      description: "Result from DeregisterPatchBaselineForPatchGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description:
              "The ID of the patch baseline the patch group was deregistered from.",
          },
          PatchGroup: {
            type: "string",
            description:
              "The name of the patch group deregistered from the patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deregisterPatchBaselineForPatchGroup;
