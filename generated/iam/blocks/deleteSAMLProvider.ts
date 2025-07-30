import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteSAMLProviderCommand } from "@aws-sdk/client-iam";

const deleteSAMLProvider: AppBlock = {
  name: "Delete SAML Provider",
  description: "Deletes a SAML provider resource in IAM.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SAMLProviderArn: {
          name: "SAML Provider Arn",
          description:
            "The Amazon Resource Name (ARN) of the SAML provider to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteSAMLProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete SAML Provider Result",
      description: "Result from DeleteSAMLProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSAMLProvider;
