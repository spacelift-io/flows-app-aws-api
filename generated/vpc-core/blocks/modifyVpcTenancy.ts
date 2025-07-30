import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyVpcTenancyCommand } from "@aws-sdk/client-ec2";

const modifyVpcTenancy: AppBlock = {
  name: "Modify Vpc Tenancy",
  description: "Modifies the instance tenancy attribute of the specified VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
        },
        InstanceTenancy: {
          name: "Instance Tenancy",
          description: "The instance tenancy attribute for the VPC.",
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
        });

        const command = new ModifyVpcTenancyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Tenancy Result",
      description: "Result from ModifyVpcTenancy operation",
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

export default modifyVpcTenancy;
