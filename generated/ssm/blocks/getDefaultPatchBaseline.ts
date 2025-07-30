import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetDefaultPatchBaselineCommand } from "@aws-sdk/client-ssm";

const getDefaultPatchBaseline: AppBlock = {
  name: "Get Default Patch Baseline",
  description: "Retrieves the default patch baseline.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OperatingSystem: {
          name: "Operating System",
          description:
            "Returns the default patch baseline for the specified operating system.",
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

        const command = new GetDefaultPatchBaselineCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Default Patch Baseline Result",
      description: "Result from GetDefaultPatchBaseline operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description: "The ID of the default patch baseline.",
          },
          OperatingSystem: {
            type: "string",
            description:
              "The operating system for the returned patch baseline.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDefaultPatchBaseline;
