import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListOpsMetadataCommand } from "@aws-sdk/client-ssm";

const listOpsMetadata: AppBlock = {
  name: "List Ops Metadata",
  description:
    "Amazon Web Services Systems Manager calls this API operation when displaying all Application Manager OpsMetadata objects or blobs.",
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
            "One or more filters to limit the number of OpsMetadata objects returned by the call.",
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
              required: ["Key", "Values"],
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
          description: "A token to start the list.",
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

        const command = new ListOpsMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Ops Metadata Result",
      description: "Result from ListOpsMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpsMetadataList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceId: {
                  type: "string",
                },
                OpsMetadataArn: {
                  type: "string",
                },
                LastModifiedDate: {
                  type: "string",
                },
                LastModifiedUser: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Returns a list of OpsMetadata objects.",
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

export default listOpsMetadata;
