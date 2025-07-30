import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListFunctionsByCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const listFunctionsByCodeSigningConfig: AppBlock = {
  name: "List Functions By Code Signing Config",
  description:
    "List the functions that use the specified code signing configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CodeSigningConfigArn: {
          name: "Code Signing Config Arn",
          description:
            "The The Amazon Resource Name (ARN) of the code signing configuration.",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Specify the pagination token that's returned by a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "Maximum number of items to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListFunctionsByCodeSigningConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Functions By Code Signing Config Result",
      description: "Result from ListFunctionsByCodeSigningConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
          FunctionArns: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The function ARNs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listFunctionsByCodeSigningConfig;
