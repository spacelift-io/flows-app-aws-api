import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteResourcePolicyCommand } from "@aws-sdk/client-ssm";

const deleteResourcePolicy: AppBlock = {
  name: "Delete Resource Policy",
  description: "Deletes a Systems Manager resource policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "Amazon Resource Name (ARN) of the resource to which the policies are attached.",
          type: "string",
          required: true,
        },
        PolicyId: {
          name: "Policy Id",
          description: "The policy ID.",
          type: "string",
          required: true,
        },
        PolicyHash: {
          name: "Policy Hash",
          description: "ID of the current policy version.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DeleteResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Resource Policy Result",
      description: "Result from DeleteResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteResourcePolicy;
