import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const invoke: AppBlock = {
  name: "Invoke",
  description: "Invokes a Lambda function.",
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
        InvocationType: {
          name: "Invocation Type",
          description: "Choose from the following options.",
          type: "string",
          required: false,
        },
        LogType: {
          name: "Log Type",
          description:
            "Set to Tail to include the execution log in the response.",
          type: "string",
          required: false,
        },
        ClientContext: {
          name: "Client Context",
          description:
            "Up to 3,583 bytes of base64-encoded data about the invoking client to pass to the function in the context object.",
          type: "string",
          required: false,
        },
        Payload: {
          name: "Payload",
          description:
            "The JSON that you want to provide to your Lambda function as input.",
          type: "string",
          required: false,
        },
        Qualifier: {
          name: "Qualifier",
          description:
            "Specify a version or alias to invoke a published version of the function.",
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
        });

        const command = new InvokeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Invoke Result",
      description: "Result from Invoke operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StatusCode: {
            type: "number",
            description:
              "The HTTP status code is in the 200 range for a successful request.",
          },
          FunctionError: {
            type: "string",
            description:
              "If present, indicates that an error occurred during function execution.",
          },
          LogResult: {
            type: "string",
            description:
              "The last 4 KB of the execution log, which is base64-encoded.",
          },
          Payload: {
            type: "string",
            description: "The response from the function, or an error object.",
          },
          ExecutedVersion: {
            type: "string",
            description: "The version of the function that executed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default invoke;
