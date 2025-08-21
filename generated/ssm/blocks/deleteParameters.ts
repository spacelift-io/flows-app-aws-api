import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteParametersCommand } from "@aws-sdk/client-ssm";

const deleteParameters: AppBlock = {
  name: "Delete Parameters",
  description: "Delete a list of parameters.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Names: {
          name: "Names",
          description: "The names of the parameters to delete.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
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

        const command = new DeleteParametersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Parameters Result",
      description: "Result from DeleteParameters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DeletedParameters: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The names of the deleted parameters.",
          },
          InvalidParameters: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of parameters that weren't deleted because the parameters aren't valid.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteParameters;
