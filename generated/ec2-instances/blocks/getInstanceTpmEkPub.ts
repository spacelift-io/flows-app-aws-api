import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetInstanceTpmEkPubCommand } from "@aws-sdk/client-ec2";

const getInstanceTpmEkPub: AppBlock = {
  name: "Get Instance Tpm Ek Pub",
  description:
    "Gets the public endorsement key associated with the Nitro Trusted Platform Module (NitroTPM) for the specified instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The ID of the instance for which to get the public endorsement key.",
          type: "string",
          required: true,
        },
        KeyType: {
          name: "Key Type",
          description: "The required public endorsement key type.",
          type: "string",
          required: true,
        },
        KeyFormat: {
          name: "Key Format",
          description: "The required public endorsement key format.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Specify this parameter to verify whether the request will succeed, without actually making the request.",
          type: "boolean",
          required: false,
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

        const command = new GetInstanceTpmEkPubCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Instance Tpm Ek Pub Result",
      description: "Result from GetInstanceTpmEkPub operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the instance.",
          },
          KeyType: {
            type: "string",
            description: "The public endorsement key type.",
          },
          KeyFormat: {
            type: "string",
            description: "The public endorsement key format.",
          },
          KeyValue: {
            type: "string",
            description: "The public endorsement key material.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getInstanceTpmEkPub;
