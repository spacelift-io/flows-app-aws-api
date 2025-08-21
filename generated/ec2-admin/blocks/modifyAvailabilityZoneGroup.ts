import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyAvailabilityZoneGroupCommand,
} from "@aws-sdk/client-ec2";

const modifyAvailabilityZoneGroup: AppBlock = {
  name: "Modify Availability Zone Group",
  description:
    "Changes the opt-in status of the specified zone group for your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GroupName: {
          name: "Group Name",
          description:
            "The name of the Availability Zone group, Local Zone group, or Wavelength Zone group.",
          type: "string",
          required: true,
        },
        OptInStatus: {
          name: "Opt In Status",
          description: "Indicates whether to opt in to the zone group.",
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

        const command = new ModifyAvailabilityZoneGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Availability Zone Group Result",
      description: "Result from ModifyAvailabilityZoneGroup operation",
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

export default modifyAvailabilityZoneGroup;
