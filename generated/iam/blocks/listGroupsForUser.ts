import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListGroupsForUserCommand } from "@aws-sdk/client-iam";

const listGroupsForUser: AppBlock = {
  name: "List Groups For User",
  description: "Lists the IAM groups that the specified IAM user belongs to.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user to list groups for.",
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

        const command = new ListGroupsForUserCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Groups For User Result",
      description: "Result from ListGroupsForUser operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Groups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Path: {
                  type: "string",
                },
                GroupName: {
                  type: "string",
                },
                GroupId: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
              },
              required: ["Path", "GroupName", "GroupId", "Arn", "CreateDate"],
              additionalProperties: false,
            },
            description: "A list of groups.",
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
        required: ["Groups"],
      },
    },
  },
};

export default listGroupsForUser;
