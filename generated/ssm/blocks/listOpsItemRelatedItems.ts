import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListOpsItemRelatedItemsCommand } from "@aws-sdk/client-ssm";

const listOpsItemRelatedItems: AppBlock = {
  name: "List Ops Item Related Items",
  description:
    "Lists all related-item resources associated with a Systems Manager OpsCenter OpsItem.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsItemId: {
          name: "Ops Item Id",
          description:
            "The ID of the OpsItem for which you want to list all related-item resources.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more OpsItem filters.",
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
                Operator: {
                  type: "string",
                },
              },
              required: ["Key", "Values", "Operator"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListOpsItemRelatedItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Ops Item Related Items Result",
      description: "Result from ListOpsItemRelatedItems operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OpsItemId: {
                  type: "string",
                },
                AssociationId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                AssociationType: {
                  type: "string",
                },
                ResourceUri: {
                  type: "string",
                },
                CreatedBy: {
                  type: "object",
                  properties: {
                    Arn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                CreatedTime: {
                  type: "string",
                },
                LastModifiedBy: {
                  type: "object",
                  properties: {
                    Arn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                LastModifiedTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of related-item resources for the specified OpsItem.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOpsItemRelatedItems;
