import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  DeleteFunctionUrlConfigCommand,
} from "@aws-sdk/client-lambda";

const deleteFunctionUrlConfig: AppBlock = {
  name: "Delete Function Url Config",
  description: "Deletes a Lambda function URL.",
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
        Qualifier: {
          name: "Qualifier",
          description: "The alias name.",
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

        const command = new DeleteFunctionUrlConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Function Url Config Result",
      description: "Result from DeleteFunctionUrlConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteFunctionUrlConfig;
