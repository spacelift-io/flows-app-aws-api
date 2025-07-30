import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetFunctionConcurrencyCommand,
} from "@aws-sdk/client-lambda";

const getFunctionConcurrency: AppBlock = {
  name: "Get Function Concurrency",
  description:
    "Returns details about the reserved concurrency configuration for a function.",
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

        const command = new GetFunctionConcurrencyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Function Concurrency Result",
      description: "Result from GetFunctionConcurrency operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedConcurrentExecutions: {
            type: "number",
            description:
              "The number of simultaneous executions that are reserved for the function.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFunctionConcurrency;
