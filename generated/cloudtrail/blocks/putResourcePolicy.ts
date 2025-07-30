import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  PutResourcePolicyCommand,
} from "@aws-sdk/client-cloudtrail";

const putResourcePolicy: AppBlock = {
  name: "Put Resource Policy",
  description:
    "Attaches a resource-based permission policy to a CloudTrail event data store, dashboard, or channel.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the CloudTrail event data store, dashboard, or channel attached to the resource-based policy.",
          type: "string",
          required: true,
        },
        ResourcePolicy: {
          name: "Resource Policy",
          description:
            "A JSON-formatted string for an Amazon Web Services resource-based policy.",
          type: "string",
          required: true,
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
        });

        const command = new PutResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Resource Policy Result",
      description: "Result from PutResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the CloudTrail event data store, dashboard, or channel attached to the resource-based policy.",
          },
          ResourcePolicy: {
            type: "string",
            description:
              "The JSON-formatted string of the Amazon Web Services resource-based policy attached to the CloudTrail event data store, dashboard, or channel.",
          },
          DelegatedAdminResourcePolicy: {
            type: "string",
            description:
              "The default resource-based policy that is automatically generated for the delegated administrator of an Organizations organization.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putResourcePolicy;
