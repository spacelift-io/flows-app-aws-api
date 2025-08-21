import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableVpcClassicLinkDnsSupportCommand,
} from "@aws-sdk/client-ec2";

const enableVpcClassicLinkDnsSupport: AppBlock = {
  name: "Enable Vpc Classic Link Dns Support",
  description: "This action is deprecated.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new EnableVpcClassicLinkDnsSupportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Vpc Classic Link Dns Support Result",
      description: "Result from EnableVpcClassicLinkDnsSupport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableVpcClassicLinkDnsSupport;
