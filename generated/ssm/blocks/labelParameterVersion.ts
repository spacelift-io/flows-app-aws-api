import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, LabelParameterVersionCommand } from "@aws-sdk/client-ssm";

const labelParameterVersion: AppBlock = {
  name: "Label Parameter Version",
  description:
    "A parameter label is a user-defined alias to help you manage different versions of a parameter.",
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
            "The parameter name on which you want to attach one or more labels.",
          type: "string",
          required: true,
        },
        ParameterVersion: {
          name: "Parameter Version",
          description:
            "The specific version of the parameter on which you want to attach one or more labels.",
          type: "number",
          required: false,
        },
        Labels: {
          name: "Labels",
          description:
            "One or more labels to attach to the specified parameter version.",
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

        const command = new LabelParameterVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Label Parameter Version Result",
      description: "Result from LabelParameterVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InvalidLabels: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The label doesn't meet the requirements.",
          },
          ParameterVersion: {
            type: "number",
            description: "The version of the parameter that has been labeled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default labelParameterVersion;
