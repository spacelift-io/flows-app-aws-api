import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListComplianceItemsCommand } from "@aws-sdk/client-ssm";

const listComplianceItems: AppBlock = {
  name: "List Compliance Items",
  description:
    "For a specified resource ID, this API operation returns a list of compliance statuses for different resource types.",
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
          description: "One or more compliance filters.",
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
                Type: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        ResourceIds: {
          name: "Resource Ids",
          description:
            "The ID for the resources from which to get compliance information.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ResourceTypes: {
          name: "Resource Types",
          description:
            "The type of resource from which to get compliance information.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
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

        const command = new ListComplianceItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Compliance Items Result",
      description: "Result from ListComplianceItems operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ComplianceItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ComplianceType: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                Id: {
                  type: "string",
                },
                Title: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                ExecutionSummary: {
                  type: "object",
                  properties: {
                    ExecutionTime: {
                      type: "string",
                    },
                    ExecutionId: {
                      type: "string",
                    },
                    ExecutionType: {
                      type: "string",
                    },
                  },
                  required: ["ExecutionTime"],
                  additionalProperties: false,
                },
                Details: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of compliance information for the specified resource ID.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listComplianceItems;
