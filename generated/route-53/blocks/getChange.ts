import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, GetChangeCommand } from "@aws-sdk/client-route-53";

const getChange: AppBlock = {
  name: "Get Change",
  description: "Returns the current status of a change batch request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the change batch request.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new GetChangeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Change Result",
      description: "Result from GetChange operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeInfo: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubmittedAt: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Status", "SubmittedAt"],
            additionalProperties: false,
            description:
              "A complex type that contains information about the specified change batch.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default getChange;
