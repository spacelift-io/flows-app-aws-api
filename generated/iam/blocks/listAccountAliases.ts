import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListAccountAliasesCommand } from "@aws-sdk/client-iam";

const listAccountAliases: AppBlock = {
  name: "List Account Aliases",
  description:
    "Lists the account alias associated with the Amazon Web Services account (Note: you can have only one).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "Use this only when paginating results to indicate the maximum number of items you want in the response.",
          type: "number",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListAccountAliasesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Account Aliases Result",
      description: "Result from ListAccountAliases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountAliases: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of aliases associated with the account.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items to return.",
          },
          Marker: {
            type: "string",
            description:
              "When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.",
          },
        },
        required: ["AccountAliases"],
      },
    },
  },
};

export default listAccountAliases;
