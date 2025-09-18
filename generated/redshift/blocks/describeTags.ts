import { AppBlock, events } from "@slflows/sdk/v1";
import { RedshiftClient, DescribeTagsCommand } from "@aws-sdk/client-redshift";

const describeTags: AppBlock = {
  name: "Describe Tags",
  description: `Returns a list of tags.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceName: {
          name: "Resource Name",
          description:
            "The Amazon Resource Name (ARN) for which you want to describe the tag or tags.",
          type: "string",
          required: false,
        },
        ResourceType: {
          name: "Resource Type",
          description: "The type of resource with which you want to view tags.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number or response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "A value that indicates the starting point for the next set of response records in a subsequent request.",
          type: "string",
          required: false,
        },
        TagKeys: {
          name: "Tag Keys",
          description:
            "A tag key or keys for which you want to return all matching resources that are associated with the specified key or keys.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        TagValues: {
          name: "Tag Values",
          description:
            "A tag value or values for which you want to return all matching resources that are associated with the specified value or values.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Tags Result",
      description: "Result from DescribeTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TaggedResources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Tag: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ResourceName: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of tags with their associated resources.",
          },
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTags;
