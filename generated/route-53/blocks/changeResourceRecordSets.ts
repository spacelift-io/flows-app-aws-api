import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ChangeResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";

const changeResourceRecordSets: AppBlock = {
  name: "Change Resource Record Sets",
  description:
    "Creates, changes, or deletes a resource record set, which contains authoritative DNS information for a specified domain name or subdomain name.",
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
            "The ID of the hosted zone that contains the resource record sets that you want to change.",
          type: "string",
          required: true,
        },
        ChangeBatch: {
          name: "Change Batch",
          description:
            "A complex type that contains an optional comment and the Changes element.",
          type: {
            type: "object",
            properties: {
              Comment: {
                type: "string",
              },
              Changes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Action: {
                      type: "string",
                    },
                    ResourceRecordSet: {
                      type: "object",
                      properties: {
                        Name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SetIdentifier: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Weight: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Region: {
                          type: "object",
                          additionalProperties: true,
                        },
                        GeoLocation: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Failover: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MultiValueAnswer: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TTL: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResourceRecords: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AliasTarget: {
                          type: "object",
                          additionalProperties: true,
                        },
                        HealthCheckId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TrafficPolicyInstanceId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CidrRoutingConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        GeoProximityLocation: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Name", "Type"],
                      additionalProperties: false,
                    },
                  },
                  required: ["Action", "ResourceRecordSet"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Changes"],
            additionalProperties: false,
          },
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

        const command = new ChangeResourceRecordSetsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Change Resource Record Sets Result",
      description: "Result from ChangeResourceRecordSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeInfo: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubmittedAt: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Status", "SubmittedAt"],
            additionalProperties: false,
            description:
              "A complex type that contains information about changes made to your hosted zone.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default changeResourceRecordSets;
