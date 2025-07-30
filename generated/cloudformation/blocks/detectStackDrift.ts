import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DetectStackDriftCommand,
} from "@aws-sdk/client-cloudformation";

const detectStackDrift: AppBlock = {
  name: "Detect Stack Drift",
  description:
    "Detects whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters.",
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
            "The name of the stack for which you want to detect drift.",
          type: "string",
          required: true,
        },
        LogicalResourceIds: {
          name: "Logical Resource Ids",
          description:
            "The logical names of any resources you want to use as filters.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new DetectStackDriftCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detect Stack Drift Result",
      description: "Result from DetectStackDrift operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackDriftDetectionId: {
            type: "string",
            description:
              "The ID of the drift detection results of this operation.",
          },
        },
        required: ["StackDriftDetectionId"],
      },
    },
  },
};

export default detectStackDrift;
