import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribePatchGroupsCommand } from "@aws-sdk/client-ssm";

const describePatchGroups: AppBlock = {
  name: "Describe Patch Groups",
  description:
    "Lists all patch groups that have been registered with patch baselines.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of patch groups to return (per page).",
          type: "number",
          required: false,
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

        const command = new DescribePatchGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Patch Groups Result",
      description: "Result from DescribePatchGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Mappings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PatchGroup: {
                  type: "string",
                },
                BaselineIdentity: {
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
              },
              additionalProperties: false,
            },
            description:
              "Each entry in the array contains: PatchGroup: string (between 1 and 256 characters.",
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

export default describePatchGroups;
