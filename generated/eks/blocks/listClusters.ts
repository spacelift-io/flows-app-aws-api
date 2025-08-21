import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListClustersCommand } from "@aws-sdk/client-eks";

const listClusters: AppBlock = {
  name: "List Clusters",
  description:
    "Lists the Amazon EKS clusters in your Amazon Web Services account in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of results, returned in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        include: {
          name: "include",
          description:
            "Indicates whether external clusters are included in the returned list.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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
          clusters: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of all of the clusters for your account in the specified Amazon Web Services Region .",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listClusters;
