import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, PutAttributesCommand } from "@aws-sdk/client-ecs";

const putAttributes: AppBlock = {
  name: "Put Attributes",
  description: "Create or update an attribute on an Amazon ECS resource.",
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
            "The short name or full Amazon Resource Name (ARN) of the cluster that contains the resource to apply attributes.",
          type: "string",
          required: false,
        },
        attributes: {
          name: "attributes",
          description: "The attributes to apply to your resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
                targetType: {
                  type: "string",
                },
                targetId: {
                  type: "string",
                },
              },
              required: ["name"],
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new PutAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Attributes Result",
      description: "Result from PutAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          attributes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
                targetType: {
                  type: "string",
                },
                targetId: {
                  type: "string",
                },
              },
              required: ["name"],
              additionalProperties: false,
            },
            description: "The attributes applied to your resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putAttributes;
