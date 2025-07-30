import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, GetDNSSECCommand } from "@aws-sdk/client-route-53";

const getDNSSEC: AppBlock = {
  name: "Get DNSSEC",
  description:
    "Returns information about DNSSEC for a specific hosted zone, including the key-signing keys (KSKs) in the hosted zone.",
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
        });

        const command = new GetDNSSECCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get DNSSEC Result",
      description: "Result from GetDNSSEC operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "object",
            properties: {
              ServeSignature: {
                type: "string",
              },
              StatusMessage: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "A string representing the status of DNSSEC.",
          },
          KeySigningKeys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                KmsArn: {
                  type: "string",
                },
                Flag: {
                  type: "number",
                },
                SigningAlgorithmMnemonic: {
                  type: "string",
                },
                SigningAlgorithmType: {
                  type: "number",
                },
                DigestAlgorithmMnemonic: {
                  type: "string",
                },
                DigestAlgorithmType: {
                  type: "number",
                },
                KeyTag: {
                  type: "number",
                },
                DigestValue: {
                  type: "string",
                },
                PublicKey: {
                  type: "string",
                },
                DSRecord: {
                  type: "string",
                },
                DNSKEYRecord: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                LastModifiedDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The key-signing keys (KSKs) in your account.",
          },
        },
        required: ["Status", "KeySigningKeys"],
      },
    },
  },
};

export default getDNSSEC;
