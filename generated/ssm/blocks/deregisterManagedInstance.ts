import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DeregisterManagedInstanceCommand,
} from "@aws-sdk/client-ssm";

const deregisterManagedInstance: AppBlock = {
  name: "Deregister Managed Instance",
  description:
    "Removes the server or virtual machine from the list of registered servers.",
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
            "The ID assigned to the managed node when you registered it using the activation process.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeregisterManagedInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Managed Instance Result",
      description: "Result from DeregisterManagedInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deregisterManagedInstance;
