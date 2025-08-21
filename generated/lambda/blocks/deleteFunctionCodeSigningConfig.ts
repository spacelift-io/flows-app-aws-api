import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  DeleteFunctionCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const deleteFunctionCodeSigningConfig: AppBlock = {
  name: "Delete Function Code Signing Config",
  description: "Removes the code signing configuration from the function.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteFunctionCodeSigningConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Function Code Signing Config Result",
      description: "Result from DeleteFunctionCodeSigningConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteFunctionCodeSigningConfig;
