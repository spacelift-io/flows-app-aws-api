import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribePatchBaselinesCommand } from "@aws-sdk/client-ssm";

const describePatchBaselines: AppBlock = {
  name: "Describe Patch Baselines",
  description: "Lists the patch baselines in your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Each element in the array is a structure containing a key-value pair.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of patch baselines to return (per page).",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
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

        const command = new DescribePatchBaselinesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Patch Baselines Result",
      description: "Result from DescribePatchBaselines operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineIdentities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                BaselineId: {
                  type: "string",
                },
                BaselineName: {
                  type: "string",
                },
                OperatingSystem: {
                  type: "string",
                },
                BaselineDescription: {
                  type: "string",
                },
                DefaultBaseline: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description: "An array of PatchBaselineIdentity elements.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePatchBaselines;
