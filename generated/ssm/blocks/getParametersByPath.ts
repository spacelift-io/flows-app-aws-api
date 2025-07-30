import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const getParametersByPath: AppBlock = {
  name: "Get Parameters By Path",
  description:
    "Retrieve information about one or more parameters under a specified level in a hierarchy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Path: {
          name: "Path",
          description: "The hierarchy for the parameter.",
          type: "string",
          required: true,
        },
        Recursive: {
          name: "Recursive",
          description: "Retrieve all parameters within a hierarchy.",
          type: "boolean",
          required: false,
        },
        ParameterFilters: {
          name: "Parameter Filters",
          description: "Filters to limit the request results.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Option: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Key"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        WithDecryption: {
          name: "With Decryption",
          description:
            "Retrieve all parameters in a hierarchy with their value decrypted.",
          type: "boolean",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
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

        const command = new GetParametersByPathCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Parameters By Path Result",
      description: "Result from GetParametersByPath operation",
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
            description:
              "A list of parameters found in the specified hierarchy.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getParametersByPath;
