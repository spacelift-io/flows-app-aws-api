import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackDriftDetectionStatusCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackDriftDetectionStatus: AppBlock = {
  name: "Describe Stack Drift Detection Status",
  description: "Returns information about a stack drift detection operation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackDriftDetectionId: {
          name: "Stack Drift Detection Id",
          description:
            "The ID of the drift detection results of this operation.",
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
        });

        const command = new DescribeStackDriftDetectionStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Drift Detection Status Result",
      description: "Result from DescribeStackDriftDetectionStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackId: {
            type: "string",
            description: "The ID of the stack.",
          },
          StackDriftDetectionId: {
            type: "string",
            description:
              "The ID of the drift detection results of this operation.",
          },
          StackDriftStatus: {
            type: "string",
            description:
              "Status of the stack's actual configuration compared to its expected configuration.",
          },
          DetectionStatus: {
            type: "string",
            description: "The status of the stack drift detection operation.",
          },
          DetectionStatusReason: {
            type: "string",
            description:
              "The reason the stack drift detection operation has its current status.",
          },
          DriftedStackResourceCount: {
            type: "number",
            description: "Total number of stack resources that have drifted.",
          },
          Timestamp: {
            type: "string",
            description:
              "Time at which the stack drift detection operation was initiated.",
          },
        },
        required: [
          "StackId",
          "StackDriftDetectionId",
          "DetectionStatus",
          "Timestamp",
        ],
      },
    },
  },
};

export default describeStackDriftDetectionStatus;
