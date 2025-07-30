import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  AssociateAliasCommand,
} from "@aws-sdk/client-cloudfront";

const associateAlias: AppBlock = {
  name: "Associate Alias",
  description:
    "The AssociateAlias API operation only supports standard distributions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TargetDistributionId: {
          name: "Target Distribution Id",
          description:
            "The ID of the standard distribution that you're associating the alias with.",
          type: "string",
          required: true,
        },
        Alias: {
          name: "Alias",
          description:
            "The alias (also known as a CNAME) to add to the target standard distribution.",
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
        });

        const command = new AssociateAliasCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Alias Result",
      description: "Result from AssociateAlias operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default associateAlias;
