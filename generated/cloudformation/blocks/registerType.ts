import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  RegisterTypeCommand,
} from "@aws-sdk/client-cloudformation";

const registerType: AppBlock = {
  name: "Register Type",
  description: "Registers an extension with the CloudFormation service.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description: "The kind of extension.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension being registered.",
          type: "string",
          required: true,
        },
        SchemaHandlerPackage: {
          name: "Schema Handler Package",
          description:
            "A URL to the S3 bucket that contains the extension project package that contains the necessary files for the extension you want to register.",
          type: "string",
          required: true,
        },
        LoggingConfig: {
          name: "Logging Config",
          description:
            "Specifies logging configuration information for an extension.",
          type: {
            type: "object",
            properties: {
              LogRoleArn: {
                type: "string",
              },
              LogGroupName: {
                type: "string",
              },
            },
            required: ["LogRoleArn", "LogGroupName"],
            additionalProperties: false,
          },
          required: false,
        },
        ExecutionRoleArn: {
          name: "Execution Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the extension.",
          type: "string",
          required: false,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "A unique identifier that acts as an idempotency key for this registration request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new RegisterTypeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Type Result",
      description: "Result from RegisterType operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RegistrationToken: {
            type: "string",
            description: "The identifier for this registration request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerType;
