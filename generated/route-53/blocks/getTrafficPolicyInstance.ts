import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetTrafficPolicyInstanceCommand,
} from "@aws-sdk/client-route-53";

const getTrafficPolicyInstance: AppBlock = {
  name: "Get Traffic Policy Instance",
  description: "Gets information about a specified traffic policy instance.",
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
          description:
            "The ID of the traffic policy instance that you want to get information about.",
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
        });

        const command = new GetTrafficPolicyInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Traffic Policy Instance Result",
      description: "Result from GetTrafficPolicyInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrafficPolicyInstance: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              HostedZoneId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              TTL: {
                type: "number",
              },
              State: {
                type: "string",
              },
              Message: {
                type: "string",
              },
              TrafficPolicyId: {
                type: "string",
              },
              TrafficPolicyVersion: {
                type: "number",
              },
              TrafficPolicyType: {
                type: "string",
              },
            },
            required: [
              "Id",
              "HostedZoneId",
              "Name",
              "TTL",
              "State",
              "Message",
              "TrafficPolicyId",
              "TrafficPolicyVersion",
              "TrafficPolicyType",
            ],
            additionalProperties: false,
            description:
              "A complex type that contains settings for the traffic policy instance.",
          },
        },
        required: ["TrafficPolicyInstance"],
      },
    },
  },
};

export default getTrafficPolicyInstance;
