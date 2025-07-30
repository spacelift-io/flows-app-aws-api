import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeTypeRegistrationCommand,
} from "@aws-sdk/client-cloudformation";

const describeTypeRegistration: AppBlock = {
  name: "Describe Type Registration",
  description:
    "Returns information about an extension's registration, including its current status and type and version identifiers.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RegistrationToken: {
          name: "Registration Token",
          description: "The identifier for this registration request.",
          type: "string",
          required: true,
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
        });

        const command = new DescribeTypeRegistrationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Type Registration Result",
      description: "Result from DescribeTypeRegistration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ProgressStatus: {
            type: "string",
            description:
              "The current status of the extension registration request.",
          },
          Description: {
            type: "string",
            description:
              "The description of the extension registration request.",
          },
          TypeArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the extension being registered.",
          },
          TypeVersionArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of this specific version of the extension being registered.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTypeRegistration;
