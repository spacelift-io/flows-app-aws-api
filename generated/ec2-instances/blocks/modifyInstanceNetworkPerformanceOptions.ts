import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceNetworkPerformanceOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceNetworkPerformanceOptions: AppBlock = {
  name: "Modify Instance Network Performance Options",
  description:
    "Change the configuration of the network performance options for an existing instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance to update.",
          type: "string",
          required: true,
        },
        BandwidthWeighting: {
          name: "Bandwidth Weighting",
          description:
            "Specify the bandwidth weighting option to boost the associated type of baseline bandwidth, as follows: default This option uses the standard bandwidth configuration for your instance type.",
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

        const command = new ModifyInstanceNetworkPerformanceOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Network Performance Options Result",
      description:
        "Result from ModifyInstanceNetworkPerformanceOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The instance ID that was updated.",
          },
          BandwidthWeighting: {
            type: "string",
            description:
              "Contains the updated configuration for bandwidth weighting on the specified instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceNetworkPerformanceOptions;
