import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribePublisherCommand,
} from "@aws-sdk/client-cloudformation";

const describePublisher: AppBlock = {
  name: "Describe Publisher",
  description:
    "Returns information about a CloudFormation extension publisher.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PublisherId: {
          name: "Publisher Id",
          description: "The ID of the extension publisher.",
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

        const command = new DescribePublisherCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Publisher Result",
      description: "Result from DescribePublisher operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublisherId: {
            type: "string",
            description: "The ID of the extension publisher.",
          },
          PublisherStatus: {
            type: "string",
            description: "Whether the publisher is verified.",
          },
          IdentityProvider: {
            type: "string",
            description:
              "The type of account used as the identity provider when registering this publisher with CloudFormation.",
          },
          PublisherProfile: {
            type: "string",
            description:
              "The URL to the publisher's profile with the identity provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePublisher;
