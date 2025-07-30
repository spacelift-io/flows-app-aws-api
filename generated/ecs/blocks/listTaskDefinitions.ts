import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListTaskDefinitionsCommand } from "@aws-sdk/client-ecs";

const listTaskDefinitions: AppBlock = {
  name: "List Task Definitions",
  description:
    "Returns a list of task definitions that are registered to your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        familyPrefix: {
          name: "family Prefix",
          description:
            "The full family name to filter the ListTaskDefinitions results with.",
          type: "string",
          required: false,
        },
        status: {
          name: "status",
          description:
            "The task definition status to filter the ListTaskDefinitions results with.",
          type: "string",
          required: false,
        },
        sort: {
          name: "sort",
          description: "The order to sort the results in.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListTaskDefinitions request indicating that more results are available to fulfill the request and further calls will be needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of task definition results that ListTaskDefinitions returned in paginated output.",
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
        });

        const command = new ListTaskDefinitionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Task Definitions Result",
      description: "Result from ListTaskDefinitions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          taskDefinitionArns: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of task definition Amazon Resource Name (ARN) entries for the ListTaskDefinitions request.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListTaskDefinitions request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTaskDefinitions;
