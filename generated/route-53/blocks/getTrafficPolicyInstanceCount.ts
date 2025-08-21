import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetTrafficPolicyInstanceCountCommand,
} from "@aws-sdk/client-route-53";

const getTrafficPolicyInstanceCount: AppBlock = {
  name: "Get Traffic Policy Instance Count",
  description:
    "Gets the number of traffic policy instances that are associated with the current Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetTrafficPolicyInstanceCountCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Traffic Policy Instance Count Result",
      description: "Result from GetTrafficPolicyInstanceCount operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrafficPolicyInstanceCount: {
            type: "number",
            description:
              "The number of traffic policy instances that are associated with the current Amazon Web Services account.",
          },
        },
        required: ["TrafficPolicyInstanceCount"],
      },
    },
  },
};

export default getTrafficPolicyInstanceCount;
