import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, DiscoverPollEndpointCommand } from "@aws-sdk/client-ecs";

const discoverPollEndpoint: AppBlock = {
  name: "Discover Poll Endpoint",
  description:
    "This action is only used by the Amazon ECS agent, and it is not intended for use outside of the agent.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        containerInstance: {
          name: "container Instance",
          description:
            "The container instance ID or full ARN of the container instance.",
          type: "string",
          required: false,
        },
        cluster: {
          name: "cluster",
          description:
            "The short name or full Amazon Resource Name (ARN) of the cluster that the container instance belongs to.",
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
        });

        const command = new DiscoverPollEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Discover Poll Endpoint Result",
      description: "Result from DiscoverPollEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          endpoint: {
            type: "string",
            description: "The endpoint for the Amazon ECS agent to poll.",
          },
          telemetryEndpoint: {
            type: "string",
            description: "The telemetry endpoint for the Amazon ECS agent.",
          },
          serviceConnectEndpoint: {
            type: "string",
            description:
              "The endpoint for the Amazon ECS agent to poll for Service Connect configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default discoverPollEndpoint;
