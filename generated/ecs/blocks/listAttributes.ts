import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListAttributesCommand } from "@aws-sdk/client-ecs";

const listAttributes: AppBlock = {
  name: "List Attributes",
  description:
    "Lists the attributes for Amazon ECS resources within a specified target type and cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        cluster: {
          name: "cluster",
          description:
            "The short name or full Amazon Resource Name (ARN) of the cluster to list attributes.",
          type: "string",
          required: false,
        },
        targetType: {
          name: "target Type",
          description: "The type of the target to list attributes with.",
          type: "string",
          required: true,
        },
        attributeName: {
          name: "attribute Name",
          description: "The name of the attribute to filter the results with.",
          type: "string",
          required: false,
        },
        attributeValue: {
          name: "attribute Value",
          description: "The value of the attribute to filter results with.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListAttributes request indicating that more results are available to fulfill the request and further calls are needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of cluster results that ListAttributes returned in paginated output.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
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

        const command = new ListAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Attributes Result",
      description: "Result from ListAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          attributes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
                targetType: {
                  type: "string",
                },
                targetId: {
                  type: "string",
                },
              },
              required: ["name"],
              additionalProperties: false,
            },
            description:
              "A list of attribute objects that meet the criteria of the request.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListAttributes request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAttributes;
