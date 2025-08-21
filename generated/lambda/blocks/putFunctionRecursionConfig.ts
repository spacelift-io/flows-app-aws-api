import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  PutFunctionRecursionConfigCommand,
} from "@aws-sdk/client-lambda";

const putFunctionRecursionConfig: AppBlock = {
  name: "Put Function Recursion Config",
  description: "Sets your function's recursive loop detection configuration.",
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
        RecursiveLoop: {
          name: "Recursive Loop",
          description:
            "If you set your function's recursive loop detection configuration to Allow, Lambda doesn't take any action when it detects your function being invoked as part of a recursive loop.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutFunctionRecursionConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Function Recursion Config Result",
      description: "Result from PutFunctionRecursionConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RecursiveLoop: {
            type: "string",
            description:
              "The status of your function's recursive loop detection configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putFunctionRecursionConfig;
