import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  UpdateTrafficPolicyInstanceCommand,
} from "@aws-sdk/client-route-53";

const updateTrafficPolicyInstance: AppBlock = {
  name: "Update Traffic Policy Instance",
  description:
    "After you submit a UpdateTrafficPolicyInstance request, there's a brief delay while Route 53 creates the resource record sets that are specified in the traffic policy definition.",
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
            "The ID of the traffic policy instance that you want to update.",
          type: "string",
          required: true,
        },
        TTL: {
          name: "TTL",
          description:
            "The TTL that you want Amazon Route 53 to assign to all of the updated resource record sets.",
          type: "number",
          required: true,
        },
        TrafficPolicyId: {
          name: "Traffic Policy Id",
          description:
            "The ID of the traffic policy that you want Amazon Route 53 to use to update resource record sets for the specified traffic policy instance.",
          type: "string",
          required: true,
        },
        TrafficPolicyVersion: {
          name: "Traffic Policy Version",
          description:
            "The version of the traffic policy that you want Amazon Route 53 to use to update resource record sets for the specified traffic policy instance.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateTrafficPolicyInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Traffic Policy Instance Result",
      description: "Result from UpdateTrafficPolicyInstance operation",
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
              "A complex type that contains settings for the updated traffic policy instance.",
          },
        },
        required: ["TrafficPolicyInstance"],
      },
    },
  },
};

export default updateTrafficPolicyInstance;
