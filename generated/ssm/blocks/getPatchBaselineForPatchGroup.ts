import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  GetPatchBaselineForPatchGroupCommand,
} from "@aws-sdk/client-ssm";

const getPatchBaselineForPatchGroup: AppBlock = {
  name: "Get Patch Baseline For Patch Group",
  description:
    "Retrieves the patch baseline that should be used for the specified patch group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PatchGroup: {
          name: "Patch Group",
          description:
            "The name of the patch group whose patch baseline should be retrieved.",
          type: "string",
          required: true,
        },
        OperatingSystem: {
          name: "Operating System",
          description:
            "Returns the operating system rule specified for patch groups using the patch baseline.",
          type: "string",
          required: false,
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

        const command = new GetPatchBaselineForPatchGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Patch Baseline For Patch Group Result",
      description: "Result from GetPatchBaselineForPatchGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description:
              "The ID of the patch baseline that should be used for the patch group.",
          },
          PatchGroup: {
            type: "string",
            description: "The name of the patch group.",
          },
          OperatingSystem: {
            type: "string",
            description:
              "The operating system rule specified for patch groups using the patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPatchBaselineForPatchGroup;
