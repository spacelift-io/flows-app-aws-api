import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const getParameters: AppBlock = {
  name: "Get Parameters",
  description:
    "Get information about one or more parameters by specifying multiple parameter names.",
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
          description:
            "The names or Amazon Resource Names (ARNs) of the parameters that you want to query.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        WithDecryption: {
          name: "With Decryption",
          description: "Return decrypted secure string value.",
          type: "boolean",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetParametersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Parameters Result",
      description: "Result from GetParameters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Parameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
                Version: {
                  type: "number",
                },
                Selector: {
                  type: "string",
                },
                SourceResult: {
                  type: "string",
                },
                LastModifiedDate: {
                  type: "string",
                },
                ARN: {
                  type: "string",
                },
                DataType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of details for a parameter.",
          },
          InvalidParameters: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of parameters that aren't formatted correctly or don't run during an execution.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getParameters;
