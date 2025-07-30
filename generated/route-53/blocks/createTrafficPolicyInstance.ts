import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateTrafficPolicyInstanceCommand,
} from "@aws-sdk/client-route-53";

const createTrafficPolicyInstance: AppBlock = {
  name: "Create Traffic Policy Instance",
  description:
    "Creates resource record sets in a specified hosted zone based on the settings in a specified traffic policy version.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "The ID of the hosted zone that you want Amazon Route 53 to create resource record sets in by using the configuration in a traffic policy.",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The domain name (such as example.",
          type: "string",
          required: true,
        },
        TTL: {
          name: "TTL",
          description:
            "(Optional) The TTL that you want Amazon Route 53 to assign to all of the resource record sets that it creates in the specified hosted zone.",
          type: "number",
          required: true,
        },
        TrafficPolicyId: {
          name: "Traffic Policy Id",
          description:
            "The ID of the traffic policy that you want to use to create resource record sets in the specified hosted zone.",
          type: "string",
          required: true,
        },
        TrafficPolicyVersion: {
          name: "Traffic Policy Version",
          description:
            "The version of the traffic policy that you want to use to create resource record sets in the specified hosted zone.",
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

        const command = new CreateTrafficPolicyInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Traffic Policy Instance Result",
      description: "Result from CreateTrafficPolicyInstance operation",
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
              "A complex type that contains settings for the new traffic policy instance.",
          },
          Location: {
            type: "string",
            description:
              "A unique URL that represents a new traffic policy instance.",
          },
        },
        required: ["TrafficPolicyInstance", "Location"],
      },
    },
  },
};

export default createTrafficPolicyInstance;
