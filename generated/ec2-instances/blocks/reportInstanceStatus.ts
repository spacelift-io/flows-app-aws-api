import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReportInstanceStatusCommand } from "@aws-sdk/client-ec2";

const reportInstanceStatus: AppBlock = {
  name: "Report Instance Status",
  description: "Submits feedback about the status of an instance.",
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
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Instances: {
          name: "Instances",
          description: "The instances.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Status: {
          name: "Status",
          description: "The status of all instances listed.",
          type: "string",
          required: true,
        },
        StartTime: {
          name: "Start Time",
          description:
            "The time at which the reported instance health state began.",
          type: "string",
          required: false,
        },
        EndTime: {
          name: "End Time",
          description:
            "The time at which the reported instance health state ended.",
          type: "string",
          required: false,
        },
        ReasonCodes: {
          name: "Reason Codes",
          description:
            "The reason codes that describe the health state of your instance.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "Descriptive text about the health state of your instance.",
          type: "string",
          required: false,
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

        const command = new ReportInstanceStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Report Instance Status Result",
      description: "Result from ReportInstanceStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default reportInstanceStatus;
