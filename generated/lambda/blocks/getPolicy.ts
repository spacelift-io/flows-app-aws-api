import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, GetPolicyCommand } from "@aws-sdk/client-lambda";

const getPolicy: AppBlock = {
  name: "Get Policy",
  description:
    "Returns the resource-based IAM policy for a function, version, or alias.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description:
            "The name or ARN of the Lambda function, version, or alias.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description:
            "Specify a version or alias to get the policy for that resource.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
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

        const command = new GetPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Policy Result",
      description: "Result from GetPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "string",
            description: "The resource-based policy.",
          },
          RevisionId: {
            type: "string",
            description:
              "A unique identifier for the current revision of the policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPolicy;
