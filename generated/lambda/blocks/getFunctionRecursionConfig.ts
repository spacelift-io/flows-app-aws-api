import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetFunctionRecursionConfigCommand,
} from "@aws-sdk/client-lambda";

const getFunctionRecursionConfig: AppBlock = {
  name: "Get Function Recursion Config",
  description:
    "Returns your function's recursive loop detection configuration.",
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
          description: "",
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

        const command = new GetFunctionRecursionConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Function Recursion Config Result",
      description: "Result from GetFunctionRecursionConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RecursiveLoop: {
            type: "string",
            description:
              "If your function's recursive loop detection configuration is Allow, Lambda doesn't take any action when it detects your function being invoked as part of a recursive loop.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFunctionRecursionConfig;
