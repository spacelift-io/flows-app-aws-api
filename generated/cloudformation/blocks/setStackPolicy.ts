import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  SetStackPolicyCommand,
} from "@aws-sdk/client-cloudformation";

const setStackPolicy: AppBlock = {
  name: "Set Stack Policy",
  description: "Sets a stack policy for a specified stack.",
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
            "The name or unique stack ID that you want to associate a policy with.",
          type: "string",
          required: true,
        },
        StackPolicyBody: {
          name: "Stack Policy Body",
          description: "Structure that contains the stack policy body.",
          type: "string",
          required: false,
        },
        StackPolicyURL: {
          name: "Stack Policy URL",
          description: "Location of a file that contains the stack policy.",
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

        const command = new SetStackPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Stack Policy Result",
      description: "Result from SetStackPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setStackPolicy;
