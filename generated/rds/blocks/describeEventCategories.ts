import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeEventCategoriesCommand } from "@aws-sdk/client-rds";

const describeEventCategories: AppBlock = {
  name: "Describe Event Categories",
  description:
    "Displays a list of categories for all event source types, or, if specified, for a specified source type.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceType: {
          name: "Source Type",
          description: "The type of source that is generating the events.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new DescribeEventCategoriesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Event Categories Result",
      description: "Result from DescribeEventCategories operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventCategoriesMapList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SourceType: {
                  type: "string",
                },
                EventCategories: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of EventCategoriesMap data types.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEventCategories;
