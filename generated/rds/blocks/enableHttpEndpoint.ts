import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, EnableHttpEndpointCommand } from "@aws-sdk/client-rds";

const enableHttpEndpoint: AppBlock = {
  name: "Enable Http Endpoint",
  description: "Enables the HTTP endpoint for the DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description: "The Amazon Resource Name (ARN) of the DB cluster.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new EnableHttpEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Http Endpoint Result",
      description: "Result from EnableHttpEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceArn: {
            type: "string",
            description: "The ARN of the DB cluster.",
          },
          HttpEndpointEnabled: {
            type: "boolean",
            description:
              "Indicates whether the HTTP endpoint is enabled or disabled for the DB cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableHttpEndpoint;
