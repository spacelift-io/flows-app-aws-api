import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyInstancePlacementCommand } from "@aws-sdk/client-ec2";

const modifyInstancePlacement: AppBlock = {
  name: "Modify Instance Placement",
  description: "Modifies the placement attributes for a specified instance.",
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
            "The name of the placement group in which to place the instance.",
          type: "string",
          required: false,
        },
        PartitionNumber: {
          name: "Partition Number",
          description:
            "The number of the partition in which to place the instance.",
          type: "number",
          required: false,
        },
        HostResourceGroupArn: {
          name: "Host Resource Group Arn",
          description:
            "The ARN of the host resource group in which to place the instance.",
          type: "string",
          required: false,
        },
        GroupId: {
          name: "Group Id",
          description: "The Group Id of a placement group.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance that you are modifying.",
          type: "string",
          required: true,
        },
        Tenancy: {
          name: "Tenancy",
          description: "The tenancy for the instance.",
          type: "string",
          required: false,
        },
        Affinity: {
          name: "Affinity",
          description: "The affinity setting for the instance.",
          type: "string",
          required: false,
        },
        HostId: {
          name: "Host Id",
          description:
            "The ID of the Dedicated Host with which to associate the instance.",
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
        });

        const command = new ModifyInstancePlacementCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Placement Result",
      description: "Result from ModifyInstancePlacement operation",
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

export default modifyInstancePlacement;
