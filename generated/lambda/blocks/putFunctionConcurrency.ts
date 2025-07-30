import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  PutFunctionConcurrencyCommand,
} from "@aws-sdk/client-lambda";

const putFunctionConcurrency: AppBlock = {
  name: "Put Function Concurrency",
  description:
    "Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level.",
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
        ReservedConcurrentExecutions: {
          name: "Reserved Concurrent Executions",
          description:
            "The number of simultaneous executions to reserve for the function.",
          type: "number",
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

        const command = new PutFunctionConcurrencyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Function Concurrency Result",
      description: "Result from PutFunctionConcurrency operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedConcurrentExecutions: {
            type: "number",
            description:
              "The number of concurrent executions that are reserved for this function.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putFunctionConcurrency;
