import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, PutResourcePolicyCommand } from "@aws-sdk/client-ssm";

const putResourcePolicy: AppBlock = {
  name: "Put Resource Policy",
  description: "Creates or updates a Systems Manager resource policy.",
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
            "Amazon Resource Name (ARN) of the resource to which you want to attach a policy.",
          type: "string",
          required: true,
        },
        Policy: {
          name: "Policy",
          description: "A policy you want to associate with a resource.",
          type: "string",
          required: true,
        },
        PolicyId: {
          name: "Policy Id",
          description: "The policy ID.",
          type: "string",
          required: false,
        },
        PolicyHash: {
          name: "Policy Hash",
          description: "ID of the current policy version.",
          type: "string",
          required: false,
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
        });

        const command = new PutResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Resource Policy Result",
      description: "Result from PutResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PolicyId: {
            type: "string",
            description: "The policy ID.",
          },
          PolicyHash: {
            type: "string",
            description: "ID of the current policy version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putResourcePolicy;
