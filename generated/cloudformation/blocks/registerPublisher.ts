import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  RegisterPublisherCommand,
} from "@aws-sdk/client-cloudformation";

const registerPublisher: AppBlock = {
  name: "Register Publisher",
  description:
    "Registers your account as a publisher of public extensions in the CloudFormation registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AcceptTermsAndConditions: {
          name: "Accept Terms And Conditions",
          description:
            "Whether you accept the Terms and Conditions for publishing extensions in the CloudFormation registry.",
          type: "boolean",
          required: false,
        },
        ConnectionArn: {
          name: "Connection Arn",
          description:
            "If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account.",
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
        });

        const command = new RegisterPublisherCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Publisher Result",
      description: "Result from RegisterPublisher operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublisherId: {
            type: "string",
            description:
              "The ID assigned this account by CloudFormation for publishing extensions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerPublisher;
