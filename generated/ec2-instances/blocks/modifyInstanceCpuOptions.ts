import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceCpuOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceCpuOptions: AppBlock = {
  name: "Modify Instance Cpu Options",
  description:
    "By default, all vCPUs for the instance type are active when you launch an instance.",
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
        CoreCount: {
          name: "Core Count",
          description:
            "The number of CPU cores to activate for the specified instance.",
          type: "number",
          required: true,
        },
        ThreadsPerCore: {
          name: "Threads Per Core",
          description: "The number of threads to run for each CPU core.",
          type: "number",
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

        const command = new ModifyInstanceCpuOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Cpu Options Result",
      description: "Result from ModifyInstanceCpuOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the instance that was updated.",
          },
          CoreCount: {
            type: "number",
            description:
              "The number of CPU cores that are running for the specified instance after the update.",
          },
          ThreadsPerCore: {
            type: "number",
            description:
              "The number of threads that are running per CPU core for the specified instance after the update.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceCpuOptions;
