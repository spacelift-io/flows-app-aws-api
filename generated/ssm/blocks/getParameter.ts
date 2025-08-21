import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const getParameter: AppBlock = {
  name: "Get Parameter",
  description:
    "Get information about a single parameter by specifying the parameter name.",
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
            "The name or Amazon Resource Name (ARN) of the parameter that you want to query.",
          type: "string",
          required: true,
        },
        WithDecryption: {
          name: "With Decryption",
          description: "Return decrypted values for secure string parameters.",
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

        const command = new GetParameterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Parameter Result",
      description: "Result from GetParameter operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Parameter: {
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
            description: "Information about a parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getParameter;
