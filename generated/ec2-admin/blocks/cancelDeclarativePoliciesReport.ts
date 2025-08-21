import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CancelDeclarativePoliciesReportCommand,
} from "@aws-sdk/client-ec2";

const cancelDeclarativePoliciesReport: AppBlock = {
  name: "Cancel Declarative Policies Report",
  description: "Cancels the generation of an account status report.",
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
        ReportId: {
          name: "Report Id",
          description: "The ID of the report.",
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

        const command = new CancelDeclarativePoliciesReportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Declarative Policies Report Result",
      description: "Result from CancelDeclarativePoliciesReport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Is true if the request succeeds, and an error otherwise.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelDeclarativePoliciesReport;
