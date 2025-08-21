import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableReachabilityAnalyzerOrganizationSharingCommand,
} from "@aws-sdk/client-ec2";

const enableReachabilityAnalyzerOrganizationSharing: AppBlock = {
  name: "Enable Reachability Analyzer Organization Sharing",
  description:
    "Establishes a trust relationship between Reachability Analyzer and Organizations.",
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

        const command =
          new EnableReachabilityAnalyzerOrganizationSharingCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Reachability Analyzer Organization Sharing Result",
      description:
        "Result from EnableReachabilityAnalyzerOrganizationSharing operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReturnValue: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableReachabilityAnalyzerOrganizationSharing;
