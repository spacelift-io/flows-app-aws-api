import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListVPCAssociationAuthorizationsCommand,
} from "@aws-sdk/client-route-53";

const listVPCAssociationAuthorizations: AppBlock = {
  name: "List VPC Association Authorizations",
  description:
    "Gets a list of the VPCs that were created by other accounts and that can be associated with a specified hosted zone because you've submitted one or more CreateVPCAssociationAuthorization requests.",
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
            "The ID of the hosted zone for which you want a list of VPCs that can be associated with the hosted zone.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Optional: If a response includes a NextToken element, there are more VPCs that can be associated with the specified hosted zone.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "Optional: An integer that specifies the maximum number of VPCs that you want Amazon Route 53 to return.",
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

        const command = new ListVPCAssociationAuthorizationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List VPC Association Authorizations Result",
      description: "Result from ListVPCAssociationAuthorizations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HostedZoneId: {
            type: "string",
            description:
              "The ID of the hosted zone that you can associate the listed VPCs with.",
          },
          NextToken: {
            type: "string",
            description:
              "When the response includes a NextToken element, there are more VPCs that can be associated with the specified hosted zone.",
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
              "The list of VPCs that are authorized to be associated with the specified hosted zone.",
          },
        },
        required: ["HostedZoneId", "VPCs"],
      },
    },
  },
};

export default listVPCAssociationAuthorizations;
