import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListUpdatesCommand } from "@aws-sdk/client-eks";

const listUpdates: AppBlock = {
  name: "List Updates",
  description:
    "Lists the updates associated with an Amazon EKS resource in your Amazon Web Services account, in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description:
            "The name of the Amazon EKS cluster to list updates for.",
          type: "string",
          required: true,
        },
        nodegroupName: {
          name: "nodegroup Name",
          description:
            "The name of the Amazon EKS managed node group to list updates for.",
          type: "string",
          required: false,
        },
        addonName: {
          name: "addon Name",
          description:
            "The names of the installed add-ons that have available updates.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of results, returned in paginated output.",
          type: "number",
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

        const command = new ListUpdatesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Updates Result",
      description: "Result from ListUpdates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          updateIds: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of all the updates for the specified cluster and Region.",
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

export default listUpdates;
