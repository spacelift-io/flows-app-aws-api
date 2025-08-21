import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  TestTypeCommand,
} from "@aws-sdk/client-cloudformation";

const testType: AppBlock = {
  name: "Test Type",
  description:
    "Tests a registered extension to make sure it meets all necessary requirements for being published in the CloudFormation registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Arn: {
          name: "Arn",
          description: "The Amazon Resource Name (ARN) of the extension.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description: "The type of the extension to test.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension to test.",
          type: "string",
          required: false,
        },
        VersionId: {
          name: "Version Id",
          description: "The version of the extension to test.",
          type: "string",
          required: false,
        },
        LogDeliveryBucket: {
          name: "Log Delivery Bucket",
          description:
            "The S3 bucket to which CloudFormation delivers the contract test execution logs.",
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

        const command = new TestTypeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Test Type Result",
      description: "Result from TestType operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TypeVersionArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the extension.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testType;
