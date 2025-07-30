import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  ListAssociatedAccessPoliciesCommand,
} from "@aws-sdk/client-eks";

const listAssociatedAccessPolicies: AppBlock = {
  name: "List Associated Access Policies",
  description: "Lists the access policies associated with an access entry.",
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
        principalArn: {
          name: "principal Arn",
          description: "The ARN of the IAM principal for the AccessEntry.",
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
        });

        const command = new ListAssociatedAccessPoliciesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Associated Access Policies Result",
      description: "Result from ListAssociatedAccessPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          clusterName: {
            type: "string",
            description: "The name of your cluster.",
          },
          principalArn: {
            type: "string",
            description: "The ARN of the IAM principal for the AccessEntry.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          },
          associatedAccessPolicies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                policyArn: {
                  type: "string",
                },
                accessScope: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    namespaces: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                associatedAt: {
                  type: "string",
                },
                modifiedAt: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of access policies associated with the access entry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAssociatedAccessPolicies;
