import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, DeleteEndpointCommand } from "@aws-sdk/client-sns";

const deleteEndpoint: AppBlock = {
  name: "Delete Endpoint",
  description:
    "Deletes the endpoint for a device and mobile app from Amazon SNS.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EndpointArn: {
          name: "Endpoint Arn",
          description: "EndpointArn of endpoint to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Endpoint Result",
      description: "Result from DeleteEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteEndpoint;
