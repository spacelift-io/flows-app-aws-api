import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListContainerInstancesCommand } from "@aws-sdk/client-ecs";

const listContainerInstances: AppBlock = {
  name: "List Container Instances",
  description: "Returns a list of container instances in a specified cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        cluster: {
          name: "cluster",
          description:
            "The short name or full Amazon Resource Name (ARN) of the cluster that hosts the container instances to list.",
          type: "string",
          required: false,
        },
        filter: {
          name: "filter",
          description:
            "You can filter the results of a ListContainerInstances operation with cluster query language statements.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListContainerInstances request indicating that more results are available to fulfill the request and further calls are needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of container instance results that ListContainerInstances returned in paginated output.",
          type: "number",
          required: false,
        },
        status: {
          name: "status",
          description: "Filters the container instances by status.",
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

        const command = new ListContainerInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Container Instances Result",
      description: "Result from ListContainerInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          containerInstanceArns: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of container instances with full ARN entries for each container instance associated with the specified cluster.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListContainerInstances request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listContainerInstances;
