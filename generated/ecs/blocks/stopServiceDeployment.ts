import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, StopServiceDeploymentCommand } from "@aws-sdk/client-ecs";

const stopServiceDeployment: AppBlock = {
  name: "Stop Service Deployment",
  description: "Stops an ongoing service deployment.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        serviceDeploymentArn: {
          name: "service Deployment Arn",
          description:
            "The ARN of the service deployment that you want to stop.",
          type: "string",
          required: true,
        },
        stopType: {
          name: "stop Type",
          description: "How you want Amazon ECS to stop the service.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
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

        const command = new StopServiceDeploymentCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Service Deployment Result",
      description: "Result from StopServiceDeployment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          serviceDeploymentArn: {
            type: "string",
            description: "The ARN of the stopped service deployment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopServiceDeployment;
