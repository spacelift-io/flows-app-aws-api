import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListContinuousDeploymentPoliciesCommand,
} from "@aws-sdk/client-cloudfront";

const listContinuousDeploymentPolicies: AppBlock = {
  name: "List Continuous Deployment Policies",
  description:
    "Gets a list of the continuous deployment policies in your Amazon Web Services account.",
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
            "Use this field when paginating results to indicate where to begin in your list of continuous deployment policies.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of continuous deployment policies that you want returned in the response.",
          type: "number",
          required: false,
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

        const command = new ListContinuousDeploymentPoliciesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Continuous Deployment Policies Result",
      description: "Result from ListContinuousDeploymentPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ContinuousDeploymentPolicyList: {
            type: "object",
            properties: {
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ContinuousDeploymentPolicy: {
                      type: "object",
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastModifiedTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ContinuousDeploymentPolicyConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: [
                        "Id",
                        "LastModifiedTime",
                        "ContinuousDeploymentPolicyConfig",
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: ["ContinuousDeploymentPolicy"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of continuous deployment policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listContinuousDeploymentPolicies;
