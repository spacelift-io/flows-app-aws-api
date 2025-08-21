import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcEndpointServicePayerResponsibilityCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcEndpointServicePayerResponsibility: AppBlock = {
  name: "Modify Vpc Endpoint Service Payer Responsibility",
  description:
    "Modifies the payer responsibility for your VPC endpoint service.",
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
          description: "The ID of the service.",
          type: "string",
          required: true,
        },
        PayerResponsibility: {
          name: "Payer Responsibility",
          description: "The entity that is responsible for the endpoint costs.",
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

        const command = new ModifyVpcEndpointServicePayerResponsibilityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Endpoint Service Payer Responsibility Result",
      description:
        "Result from ModifyVpcEndpointServicePayerResponsibility operation",
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

export default modifyVpcEndpointServicePayerResponsibility;
