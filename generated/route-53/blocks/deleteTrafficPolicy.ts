import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  DeleteTrafficPolicyCommand,
} from "@aws-sdk/client-route-53";

const deleteTrafficPolicy: AppBlock = {
  name: "Delete Traffic Policy",
  description: "Deletes a traffic policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the traffic policy that you want to delete.",
          type: "string",
          required: true,
        },
        Version: {
          name: "Version",
          description:
            "The version number of the traffic policy that you want to delete.",
          type: "number",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteTrafficPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Traffic Policy Result",
      description: "Result from DeleteTrafficPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteTrafficPolicy;
