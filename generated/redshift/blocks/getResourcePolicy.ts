import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  GetResourcePolicyCommand,
} from "@aws-sdk/client-redshift";

const getResourcePolicy: AppBlock = {
  name: "Get Resource Policy",
  description: `Get the resource policy for a specified resource.`,
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
            "The Amazon Resource Name (ARN) of the resource of which its resource policy is fetched.",
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

        const command = new GetResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Policy Result",
      description: "Result from GetResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourcePolicy: {
            type: "object",
            properties: {
              ResourceArn: {
                type: "string",
              },
              Policy: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The content of the resource policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResourcePolicy;
