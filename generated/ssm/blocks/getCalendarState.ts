import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetCalendarStateCommand } from "@aws-sdk/client-ssm";

const getCalendarState: AppBlock = {
  name: "Get Calendar State",
  description:
    "Gets the state of a Amazon Web Services Systems Manager change calendar at the current time or a specified time.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CalendarNames: {
          name: "Calendar Names",
          description:
            "The names of Amazon Resource Names (ARNs) of the Systems Manager documents (SSM documents) that represent the calendar entries for which you want to get the state.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        AtTime: {
          name: "At Time",
          description:
            "(Optional) The specific time for which you want to get calendar state information, in ISO 8601 format.",
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
        });

        const command = new GetCalendarStateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Calendar State Result",
      description: "Result from GetCalendarState operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description: "The state of the calendar.",
          },
          AtTime: {
            type: "string",
            description:
              "The time, as an ISO 8601 string, that you specified in your command.",
          },
          NextTransitionTime: {
            type: "string",
            description:
              "The time, as an ISO 8601 string, that the calendar state will change.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCalendarState;
