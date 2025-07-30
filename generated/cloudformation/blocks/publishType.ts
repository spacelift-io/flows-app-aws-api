import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  PublishTypeCommand,
} from "@aws-sdk/client-cloudformation";

const publishType: AppBlock = {
  name: "Publish Type",
  description:
    "Publishes the specified extension to the CloudFormation registry as a public extension in this Region.",
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
          description: "The type of the extension.",
          type: "string",
          required: false,
        },
        Arn: {
          name: "Arn",
          description: "The Amazon Resource Name (ARN) of the extension.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension.",
          type: "string",
          required: false,
        },
        PublicVersionNumber: {
          name: "Public Version Number",
          description:
            "The version number to assign to this version of the extension.",
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

        const command = new PublishTypeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Publish Type Result",
      description: "Result from PublishType operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicTypeArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) assigned to the public extension upon publication.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default publishType;
