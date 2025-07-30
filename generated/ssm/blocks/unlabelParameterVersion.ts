import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UnlabelParameterVersionCommand } from "@aws-sdk/client-ssm";

const unlabelParameterVersion: AppBlock = {
  name: "Unlabel Parameter Version",
  description: "Remove a label or labels from a parameter.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "The name of the parameter from which you want to delete one or more labels.",
          type: "string",
          required: true,
        },
        ParameterVersion: {
          name: "Parameter Version",
          description:
            "The specific version of the parameter which you want to delete one or more labels from.",
          type: "number",
          required: true,
        },
        Labels: {
          name: "Labels",
          description:
            "One or more labels to delete from the specified parameter version.",
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
        });

        const command = new UnlabelParameterVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unlabel Parameter Version Result",
      description: "Result from UnlabelParameterVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RemovedLabels: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of all labels deleted from the parameter.",
          },
          InvalidLabels: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The labels that aren't attached to the given parameter version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default unlabelParameterVersion;
