import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeInstancePatchesCommand } from "@aws-sdk/client-ssm";

const describeInstancePatches: AppBlock = {
  name: "Describe Instance Patches",
  description:
    "Retrieves information about the patches on the specified managed node and their state relative to the patch baseline being used for the node.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The ID of the managed node whose patch state information should be retrieved.",
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
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of patches to return (per page).",
          type: "number",
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

        const command = new DescribeInstancePatchesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Patches Result",
      description: "Result from DescribeInstancePatches operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Patches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Title: {
                  type: "string",
                },
                KBId: {
                  type: "string",
                },
                Classification: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                InstalledTime: {
                  type: "string",
                },
                CVEIds: {
                  type: "string",
                },
              },
              required: [
                "Title",
                "KBId",
                "Classification",
                "Severity",
                "State",
                "InstalledTime",
              ],
              additionalProperties: false,
            },
            description:
              "Each entry in the array is a structure containing: Title (string) KBId (string) Classification (stri...",
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

export default describeInstancePatches;
