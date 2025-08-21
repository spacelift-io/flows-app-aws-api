import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DetachInternetGatewayCommand } from "@aws-sdk/client-ec2";

const detachInternetGateway: AppBlock = {
  name: "Detach Internet Gateway",
  description:
    "Detaches an internet gateway from a VPC, disabling connectivity between the internet and the VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InternetGatewayId: {
          name: "Internet Gateway Id",
          description: "The ID of the internet gateway.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
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

        const command = new DetachInternetGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detach Internet Gateway Result",
      description: "Result from DetachInternetGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default detachInternetGateway;
