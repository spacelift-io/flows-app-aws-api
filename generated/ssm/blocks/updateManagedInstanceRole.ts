import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  UpdateManagedInstanceRoleCommand,
} from "@aws-sdk/client-ssm";

const updateManagedInstanceRole: AppBlock = {
  name: "Update Managed Instance Role",
  description:
    "Changes the Identity and Access Management (IAM) role that is assigned to the on-premises server, edge device, or virtual machines (VM).",
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
          description:
            "The ID of the managed node where you want to update the role.",
          type: "string",
          required: true,
        },
        IamRole: {
          name: "Iam Role",
          description:
            "The name of the Identity and Access Management (IAM) role that you want to assign to the managed node.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateManagedInstanceRoleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Managed Instance Role Result",
      description: "Result from UpdateManagedInstanceRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateManagedInstanceRole;
