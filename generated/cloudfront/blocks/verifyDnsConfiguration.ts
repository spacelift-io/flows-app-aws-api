import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  VerifyDnsConfigurationCommand,
} from "@aws-sdk/client-cloudfront";

const verifyDnsConfiguration: AppBlock = {
  name: "Verify Dns Configuration",
  description: "Verify the DNS configuration for your domain names.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Domain: {
          name: "Domain",
          description: "The domain name that you're verifying.",
          type: "string",
          required: false,
        },
        Identifier: {
          name: "Identifier",
          description: "The identifier of the distribution tenant.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new VerifyDnsConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Dns Configuration Result",
      description: "Result from VerifyDnsConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DnsConfigurationList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Domain: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Reason: {
                  type: "string",
                },
              },
              required: ["Domain", "Status"],
              additionalProperties: false,
            },
            description:
              "The list of domain names, their statuses, and a description of each status.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default verifyDnsConfiguration;
