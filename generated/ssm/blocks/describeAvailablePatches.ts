import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeAvailablePatchesCommand,
} from "@aws-sdk/client-ssm";

const describeAvailablePatches: AppBlock = {
  name: "Describe Available Patches",
  description: "Lists all patches eligible to be included in a patch baseline.",
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
          description: "The maximum number of patches to return (per page).",
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

        const command = new DescribeAvailablePatchesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Available Patches Result",
      description: "Result from DescribeAvailablePatches operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Patches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                ReleaseDate: {
                  type: "string",
                },
                Title: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                ContentUrl: {
                  type: "string",
                },
                Vendor: {
                  type: "string",
                },
                ProductFamily: {
                  type: "string",
                },
                Product: {
                  type: "string",
                },
                Classification: {
                  type: "string",
                },
                MsrcSeverity: {
                  type: "string",
                },
                KbNumber: {
                  type: "string",
                },
                MsrcNumber: {
                  type: "string",
                },
                Language: {
                  type: "string",
                },
                AdvisoryIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                BugzillaIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                CVEIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Name: {
                  type: "string",
                },
                Epoch: {
                  type: "number",
                },
                Version: {
                  type: "string",
                },
                Release: {
                  type: "string",
                },
                Arch: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                Repository: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "An array of patches.",
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

export default describeAvailablePatches;
