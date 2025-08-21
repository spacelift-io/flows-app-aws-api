import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListAddonsCommand } from "@aws-sdk/client-eks";

const listAddons: AppBlock = {
  name: "List Addons",
  description: "Lists the installed add-ons.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListAddonsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Addons Result",
      description: "Result from ListAddons operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          addons: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of installed add-ons.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListAddons request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAddons;
