import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListServicesCommand } from "@aws-sdk/client-ecs";

const listServices: AppBlock = {
  name: "List Services",
  description: "Returns a list of services.",
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
            "The short name or full Amazon Resource Name (ARN) of the cluster to use when filtering the ListServices results.",
          type: "string",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListServices request indicating that more results are available to fulfill the request and further calls will be needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of service results that ListServices returned in paginated output.",
          type: "number",
          required: false,
        },
        launchType: {
          name: "launch Type",
          description:
            "The launch type to use when filtering the ListServices results.",
          type: "string",
          required: false,
        },
        schedulingStrategy: {
          name: "scheduling Strategy",
          description:
            "The scheduling strategy to use when filtering the ListServices results.",
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

        const command = new ListServicesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Services Result",
      description: "Result from ListServices operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          serviceArns: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of full ARN entries for each service that's associated with the specified cluster.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListServices request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listServices;
