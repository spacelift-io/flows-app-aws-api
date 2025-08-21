import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  GetStackPolicyCommand,
} from "@aws-sdk/client-cloudformation";

const getStackPolicy: AppBlock = {
  name: "Get Stack Policy",
  description: "Returns the stack policy for a specified stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The name or unique stack ID that's associated with the stack whose policy you want to get.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetStackPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Stack Policy Result",
      description: "Result from GetStackPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackPolicyBody: {
            type: "string",
            description: "Structure that contains the stack policy body.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getStackPolicy;
