import { AppBlock, events } from "@slflows/sdk/v1";
import { CloudTrailClient, ListTagsCommand } from "@aws-sdk/client-cloudtrail";

const listTags: AppBlock = {
  name: "List Tags",
  description:
    "Lists the tags for the specified trails, event data stores, dashboards, or channels in the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceIdList: {
          name: "Resource Id List",
          description:
            "Specifies a list of trail, event data store, dashboard, or channel ARNs whose tags will be listed.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "Reserved for future use.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags Result",
      description: "Result from ListTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceTagList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceId: {
                  type: "string",
                },
                TagsList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Key"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of resource tags.",
          },
          NextToken: {
            type: "string",
            description: "Reserved for future use.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTags;
