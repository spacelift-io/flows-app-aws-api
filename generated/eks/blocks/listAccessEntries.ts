import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListAccessEntriesCommand } from "@aws-sdk/client-eks";

const listAccessEntries: AppBlock = {
  name: "List Access Entries",
  description: "Lists the access entries for your cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        associatedPolicyArn: {
          name: "associated Policy Arn",
          description: "The ARN of an AccessPolicy.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of results, returned in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListAccessEntriesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Access Entries Result",
      description: "Result from ListAccessEntries operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          accessEntries: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of access entries that exist for the cluster.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAccessEntries;
