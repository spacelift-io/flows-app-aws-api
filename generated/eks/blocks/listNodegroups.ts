import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListNodegroupsCommand } from "@aws-sdk/client-eks";

const listNodegroups: AppBlock = {
  name: "List Nodegroups",
  description:
    "Lists the managed node groups associated with the specified cluster in your Amazon Web Services account in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
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
        });

        const command = new ListNodegroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Nodegroups Result",
      description: "Result from ListNodegroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          nodegroups: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of all of the node groups associated with the specified cluster.",
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

export default listNodegroups;
