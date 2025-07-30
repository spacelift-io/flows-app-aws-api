import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, StartAccessRequestCommand } from "@aws-sdk/client-ssm";

const startAccessRequest: AppBlock = {
  name: "Start Access Request",
  description: "Starts the workflow for just-in-time node access sessions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Reason: {
          name: "Reason",
          description:
            "A brief description explaining why you are requesting access to the node.",
          type: "string",
          required: true,
        },
        Targets: {
          name: "Targets",
          description: "The node you are requesting access to.",
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
              additionalProperties: false,
            },
          },
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "Key-value pairs of metadata you want to assign to the access request.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
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

        const command = new StartAccessRequestCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Access Request Result",
      description: "Result from StartAccessRequest operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccessRequestId: {
            type: "string",
            description: "The ID of the access request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startAccessRequest;
