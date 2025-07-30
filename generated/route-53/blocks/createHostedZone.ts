import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateHostedZoneCommand,
} from "@aws-sdk/client-route-53";

const createHostedZone: AppBlock = {
  name: "Create Hosted Zone",
  description: "Creates a new public or private hosted zone.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the domain.",
          type: "string",
          required: true,
        },
        VPC: {
          name: "VPC",
          description:
            "(Private hosted zones only) A complex type that contains information about the Amazon VPC that you're associating with this hosted zone.",
          type: {
            type: "object",
            properties: {
              VPCRegion: {
                type: "string",
              },
              VPCId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        CallerReference: {
          name: "Caller Reference",
          description:
            "A unique string that identifies the request and that allows failed CreateHostedZone requests to be retried without the risk of executing the operation twice.",
          type: "string",
          required: true,
        },
        HostedZoneConfig: {
          name: "Hosted Zone Config",
          description:
            "(Optional) A complex type that contains the following optional values: For public and private hosted zones, an optional comment For private hosted zones, an optional PrivateZone element If you don't specify a comment or the PrivateZone element, omit HostedZoneConfig and the other elements.",
          type: {
            type: "object",
            properties: {
              Comment: {
                type: "string",
              },
              PrivateZone: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DelegationSetId: {
          name: "Delegation Set Id",
          description:
            "If you want to associate a reusable delegation set with this hosted zone, the ID that Amazon Route 53 assigned to the reusable delegation set when you created it.",
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
        });

        const command = new CreateHostedZoneCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Hosted Zone Result",
      description: "Result from CreateHostedZone operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HostedZone: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              CallerReference: {
                type: "string",
              },
              Config: {
                type: "object",
                properties: {
                  Comment: {
                    type: "string",
                  },
                  PrivateZone: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              ResourceRecordSetCount: {
                type: "number",
              },
              LinkedService: {
                type: "object",
                properties: {
                  ServicePrincipal: {
                    type: "string",
                  },
                  Description: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["Id", "Name", "CallerReference"],
            additionalProperties: false,
            description:
              "A complex type that contains general information about the hosted zone.",
          },
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
              "A complex type that contains information about the CreateHostedZone request.",
          },
          DelegationSet: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              CallerReference: {
                type: "string",
              },
              NameServers: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["NameServers"],
            additionalProperties: false,
            description:
              "A complex type that describes the name servers for this hosted zone.",
          },
          VPC: {
            type: "object",
            properties: {
              VPCRegion: {
                type: "string",
              },
              VPCId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "A complex type that contains information about an Amazon VPC that you associated with this hosted zone.",
          },
          Location: {
            type: "string",
            description: "The unique URL representing the new hosted zone.",
          },
        },
        required: ["HostedZone", "ChangeInfo", "DelegationSet", "Location"],
      },
    },
  },
};

export default createHostedZone;
