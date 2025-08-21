import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListServicesByNamespaceCommand } from "@aws-sdk/client-ecs";

const listServicesByNamespace: AppBlock = {
  name: "List Services By Namespace",
  description:
    "This operation lists all of the services that are associated with a Cloud Map namespace.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        namespace: {
          name: "namespace",
          description:
            "The namespace name or full Amazon Resource Name (ARN) of the Cloud Map namespace to list the services in.",
          type: "string",
          required: true,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value that's returned from a ListServicesByNamespace request.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of service results that ListServicesByNamespace returns in paginated output.",
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

        const command = new ListServicesByNamespaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Services By Namespace Result",
      description: "Result from ListServicesByNamespace operation",
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
              "The list of full ARN entries for each service that's associated with the specified namespace.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListServicesByNamespace request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listServicesByNamespace;
