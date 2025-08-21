import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  DeleteFunctionEventInvokeConfigCommand,
} from "@aws-sdk/client-lambda";

const deleteFunctionEventInvokeConfig: AppBlock = {
  name: "Delete Function Event Invoke Config",
  description:
    "Deletes the configuration for asynchronous invocation for a function, version, or alias.",
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
          description:
            "The name or ARN of the Lambda function, version, or alias.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description: "A version number or alias name.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteFunctionEventInvokeConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Function Event Invoke Config Result",
      description: "Result from DeleteFunctionEventInvokeConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteFunctionEventInvokeConfig;
