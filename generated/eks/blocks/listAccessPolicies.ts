import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListAccessPoliciesCommand } from "@aws-sdk/client-eks";

const listAccessPolicies: AppBlock = {
  name: "List Access Policies",
  description: "Lists the available access policies.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListAccessPoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Access Policies Result",
      description: "Result from ListAccessPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          accessPolicies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                arn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of available access policies.",
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

export default listAccessPolicies;
