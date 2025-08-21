import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListClustersCommand } from "@aws-sdk/client-ecs";

const listClusters: AppBlock = {
  name: "List Clusters",
  description: "Returns a list of existing clusters.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListClusters request indicating that more results are available to fulfill the request and further calls are needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of cluster results that ListClusters returned in paginated output.",
          type: "number",
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

        const command = new ListClustersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Clusters Result",
      description: "Result from ListClusters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          clusterArns: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of full Amazon Resource Name (ARN) entries for each cluster that's associated with your account.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListClusters request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listClusters;
