import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, GetAliasCommand } from "@aws-sdk/client-lambda";

const getAlias: AppBlock = {
  name: "Get Alias",
  description: "Returns details about a Lambda function alias.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description: "The name or ARN of the Lambda function.",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the alias.",
          type: "string",
          required: true,
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

        const command = new GetAliasCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Alias Result",
      description: "Result from GetAlias operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AliasArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the alias.",
          },
          Name: {
            type: "string",
            description: "The name of the alias.",
          },
          FunctionVersion: {
            type: "string",
            description: "The function version that the alias invokes.",
          },
          Description: {
            type: "string",
            description: "A description of the alias.",
          },
          RoutingConfig: {
            type: "object",
            properties: {
              AdditionalVersionWeights: {
                type: "object",
                additionalProperties: {
                  type: "number",
                },
              },
            },
            additionalProperties: false,
            description: "The routing configuration of the alias.",
          },
          RevisionId: {
            type: "string",
            description:
              "A unique identifier that changes when you update the alias.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAlias;
