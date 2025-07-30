import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, InvokeAsyncCommand } from "@aws-sdk/client-lambda";

const invokeAsync: AppBlock = {
  name: "Invoke Async",
  description: "For asynchronous function invocation, use Invoke.",
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
        InvokeArgs: {
          name: "Invoke Args",
          description:
            "The JSON that you want to provide to your Lambda function as input.",
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

        const command = new InvokeAsyncCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Invoke Async Result",
      description: "Result from InvokeAsync operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "number",
            description: "The status code.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default invokeAsync;
