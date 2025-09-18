import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteResourcePolicyCommand,
} from "@aws-sdk/client-redshift";

const deleteResourcePolicy: AppBlock = {
  name: "Delete Resource Policy",
  description: `Deletes the resource policy for a specified resource.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the resource of which its resource policy is deleted.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Resource Policy Result",
      description: "Result from DeleteResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteResourcePolicy;
