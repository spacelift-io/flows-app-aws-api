import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListNodesCommand } from "@aws-sdk/client-ssm";

const listNodes: AppBlock = {
  name: "List Nodes",
  description:
    "Takes in filters and returns a list of managed nodes matching the filter criteria.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SyncName: {
          name: "Sync Name",
          description:
            "The name of the Amazon Web Services managed resource data sync to retrieve information about.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
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
              required: ["Key", "Values"],
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

        const command = new ListNodesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Nodes Result",
      description: "Result from ListNodes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CaptureTime: {
                  type: "string",
                },
                Id: {
                  type: "string",
                },
                Owner: {
                  type: "object",
                  properties: {
                    AccountId: {
                      type: "string",
                    },
                    OrganizationalUnitId: {
                      type: "string",
                    },
                    OrganizationalUnitPath: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Region: {
                  type: "string",
                },
                NodeType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of managed nodes that match the specified filter criteria.",
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

export default listNodes;
