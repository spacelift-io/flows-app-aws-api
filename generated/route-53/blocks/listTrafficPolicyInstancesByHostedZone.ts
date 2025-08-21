import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListTrafficPolicyInstancesByHostedZoneCommand,
} from "@aws-sdk/client-route-53";

const listTrafficPolicyInstancesByHostedZone: AppBlock = {
  name: "List Traffic Policy Instances By Hosted Zone",
  description:
    "Gets information about the traffic policy instances that you created in a specified hosted zone.",
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
            "The ID of the hosted zone that you want to list traffic policy instances for.",
          type: "string",
          required: true,
        },
        TrafficPolicyInstanceNameMarker: {
          name: "Traffic Policy Instance Name Marker",
          description:
            "If the value of IsTruncated in the previous response is true, you have more traffic policy instances.",
          type: "string",
          required: false,
        },
        TrafficPolicyInstanceTypeMarker: {
          name: "Traffic Policy Instance Type Marker",
          description:
            "If the value of IsTruncated in the previous response is true, you have more traffic policy instances.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of traffic policy instances to be included in the response body for this request.",
          type: "string",
          required: false,
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

        const command = new ListTrafficPolicyInstancesByHostedZoneCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Traffic Policy Instances By Hosted Zone Result",
      description:
        "Result from ListTrafficPolicyInstancesByHostedZone operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrafficPolicyInstances: {
            type: "array",
            items: {
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
            },
            description:
              "A list that contains one TrafficPolicyInstance element for each traffic policy instance that matches the elements in the request.",
          },
          TrafficPolicyInstanceNameMarker: {
            type: "string",
            description:
              "If IsTruncated is true, TrafficPolicyInstanceNameMarker is the name of the first traffic policy instance in the next group of traffic policy instances.",
          },
          TrafficPolicyInstanceTypeMarker: {
            type: "string",
            description:
              "If IsTruncated is true, TrafficPolicyInstanceTypeMarker is the DNS type of the resource record sets that are associated with the first traffic policy instance in the next group of traffic policy instances.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more traffic policy instances to be listed.",
          },
          MaxItems: {
            type: "string",
            description:
              "The value that you specified for the MaxItems parameter in the ListTrafficPolicyInstancesByHostedZone request that produced the current response.",
          },
        },
        required: ["TrafficPolicyInstances", "IsTruncated", "MaxItems"],
      },
    },
  },
};

export default listTrafficPolicyInstancesByHostedZone;
