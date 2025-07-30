import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  InvokeWithResponseStreamCommand,
} from "@aws-sdk/client-lambda";

const invokeWithResponseStream: AppBlock = {
  name: "Invoke With Response Stream",
  description:
    "Configure your Lambda functions to stream response payloads back to clients.",
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
        InvocationType: {
          name: "Invocation Type",
          description:
            "Use one of the following options: RequestResponse (default) – Invoke the function synchronously.",
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
        Qualifier: {
          name: "Qualifier",
          description: "The alias name.",
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

        const command = new InvokeWithResponseStreamCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Invoke With Response Stream Result",
      description: "Result from InvokeWithResponseStream operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StatusCode: {
            type: "number",
            description:
              "For a successful request, the HTTP status code is in the 200 range.",
          },
          ExecutedVersion: {
            type: "string",
            description: "The version of the function that executed.",
          },
          EventStream: {
            type: "string",
            description: "The stream of response payloads.",
          },
          ResponseStreamContentType: {
            type: "string",
            description: "The type of data the stream is returning.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default invokeWithResponseStream;
