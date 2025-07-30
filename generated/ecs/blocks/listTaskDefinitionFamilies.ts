import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  ListTaskDefinitionFamiliesCommand,
} from "@aws-sdk/client-ecs";

const listTaskDefinitionFamilies: AppBlock = {
  name: "List Task Definition Families",
  description:
    "Returns a list of task definition families that are registered to your account.",
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
            "The familyPrefix is a string that's used to filter the results of ListTaskDefinitionFamilies.",
          type: "string",
          required: false,
        },
        status: {
          name: "status",
          description:
            "The task definition family status to filter the ListTaskDefinitionFamilies results with.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListTaskDefinitionFamilies request indicating that more results are available to fulfill the request and further calls will be needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of task definition family results that ListTaskDefinitionFamilies returned in paginated output.",
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

        const command = new ListTaskDefinitionFamiliesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Task Definition Families Result",
      description: "Result from ListTaskDefinitionFamilies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          families: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of task definition family names that match the ListTaskDefinitionFamilies request.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListTaskDefinitionFamilies request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTaskDefinitionFamilies;
