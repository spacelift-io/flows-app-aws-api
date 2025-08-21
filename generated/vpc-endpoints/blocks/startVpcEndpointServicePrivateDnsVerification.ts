import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  StartVpcEndpointServicePrivateDnsVerificationCommand,
} from "@aws-sdk/client-ec2";

const startVpcEndpointServicePrivateDnsVerification: AppBlock = {
  name: "Start Vpc Endpoint Service Private Dns Verification",
  description:
    "Initiates the verification process to prove that the service provider owns the private DNS name domain for the endpoint service.",
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
        ServiceId: {
          name: "Service Id",
          description: "The ID of the endpoint service.",
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

        const command =
          new StartVpcEndpointServicePrivateDnsVerificationCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Vpc Endpoint Service Private Dns Verification Result",
      description:
        "Result from StartVpcEndpointServicePrivateDnsVerification operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReturnValue: {
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

export default startVpcEndpointServicePrivateDnsVerification;
