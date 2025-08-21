import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, GetHostedZoneCommand } from "@aws-sdk/client-route-53";

const getHostedZone: AppBlock = {
  name: "Get Hosted Zone",
  description:
    "Gets information about a specified hosted zone including the four name servers assigned to the hosted zone.",
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
            "The ID of the hosted zone that you want to get information about.",
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

        const command = new GetHostedZoneCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Hosted Zone Result",
      description: "Result from GetHostedZone operation",
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
              "A complex type that contains general information about the specified hosted zone.",
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
              "A complex type that lists the Amazon Route 53 name servers for the specified hosted zone.",
          },
          VPCs: {
            type: "array",
            items: {
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
            description:
              "A complex type that contains information about the VPCs that are associated with the specified hosted zone.",
          },
        },
        required: ["HostedZone"],
      },
    },
  },
};

export default getHostedZone;
