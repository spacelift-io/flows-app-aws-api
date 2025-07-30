import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReleaseHostsCommand } from "@aws-sdk/client-ec2";

const releaseHosts: AppBlock = {
  name: "Release Hosts",
  description:
    "When you no longer want to use an On-Demand Dedicated Host it can be released.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostIds: {
          name: "Host Ids",
          description: "The IDs of the Dedicated Hosts to release.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ReleaseHostsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Release Hosts Result",
      description: "Result from ReleaseHosts operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The IDs of the Dedicated Hosts that were successfully released.",
          },
          Unsuccessful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ResourceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The IDs of the Dedicated Hosts that could not be released, including an error message.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default releaseHosts;
