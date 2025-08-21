import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  DisableHostedZoneDNSSECCommand,
} from "@aws-sdk/client-route-53";

const disableHostedZoneDNSSEC: AppBlock = {
  name: "Disable Hosted Zone DNSSEC",
  description: "Disables DNSSEC signing in a specific hosted zone.",
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
          description: "A unique string used to identify a hosted zone.",
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

        const command = new DisableHostedZoneDNSSECCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Hosted Zone DNSSEC Result",
      description: "Result from DisableHostedZoneDNSSEC operation",
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
              "A complex type that describes change information about changes made to your hosted zone.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default disableHostedZoneDNSSEC;
