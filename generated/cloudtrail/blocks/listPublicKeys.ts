import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListPublicKeysCommand,
} from "@aws-sdk/client-cloudtrail";

const listPublicKeys: AppBlock = {
  name: "List Public Keys",
  description:
    "Returns all public keys whose private keys were used to sign the digest files within the specified time range.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StartTime: {
          name: "Start Time",
          description:
            "Optionally specifies, in UTC, the start of the time range to look up public keys for CloudTrail digest files.",
          type: "string",
          required: false,
        },
        EndTime: {
          name: "End Time",
          description:
            "Optionally specifies, in UTC, the end of the time range to look up public keys for CloudTrail digest files.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "Reserved for future use.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new ListPublicKeysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Public Keys Result",
      description: "Result from ListPublicKeys operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicKeyList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Value: {
                  type: "string",
                },
                ValidityStartTime: {
                  type: "string",
                },
                ValidityEndTime: {
                  type: "string",
                },
                Fingerprint: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Contains an array of PublicKey objects.",
          },
          NextToken: {
            type: "string",
            description: "Reserved for future use.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPublicKeys;
