import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListPolicyTagsCommand } from "@aws-sdk/client-iam";

const listPolicyTags: AppBlock = {
  name: "List Policy Tags",
  description:
    "Lists the tags that are attached to the specified IAM customer managed policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicyArn: {
          name: "Policy Arn",
          description:
            "The ARN of the IAM customer managed policy whose tags you want to see.",
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

        const command = new ListPolicyTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Policy Tags Result",
      description: "Result from ListPolicyTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
            description:
              "The list of tags that are currently attached to the IAM customer managed policy.",
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
        required: ["Tags"],
      },
    },
  },
};

export default listPolicyTags;
