import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  ListPoliciesGrantingServiceAccessCommand,
} from "@aws-sdk/client-iam";

const listPoliciesGrantingServiceAccess: AppBlock = {
  name: "List Policies Granting Service Access",
  description:
    "Retrieves a list of policies that the IAM identity (user, group, or role) can use to access each specified service.",
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
        Arn: {
          name: "Arn",
          description:
            "The ARN of the IAM identity (user, group, or role) whose policies you want to list.",
          type: "string",
          required: true,
        },
        ServiceNamespaces: {
          name: "Service Namespaces",
          description:
            "The service namespace for the Amazon Web Services services whose policies you want to list.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new ListPoliciesGrantingServiceAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Policies Granting Service Access Result",
      description: "Result from ListPoliciesGrantingServiceAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PoliciesGrantingServiceAccess: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ServiceNamespace: {
                  type: "string",
                },
                Policies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      PolicyName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EntityType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EntityName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["PolicyName", "PolicyType"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A ListPoliciesGrantingServiceAccess object that contains details about the permissions policies attached to the specified identity (user, group, or role).",
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
        required: ["PoliciesGrantingServiceAccess"],
      },
    },
  },
};

export default listPoliciesGrantingServiceAccess;
