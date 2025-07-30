import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DeleteBlueGreenDeploymentCommand,
} from "@aws-sdk/client-rds";

const deleteBlueGreenDeployment: AppBlock = {
  name: "Delete Blue Green Deployment",
  description: "Deletes a blue/green deployment.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BlueGreenDeploymentIdentifier: {
          name: "Blue Green Deployment Identifier",
          description:
            "The unique identifier of the blue/green deployment to delete.",
          type: "string",
          required: true,
        },
        DeleteTarget: {
          name: "Delete Target",
          description:
            "Specifies whether to delete the resources in the green environment.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteBlueGreenDeploymentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Blue Green Deployment Result",
      description: "Result from DeleteBlueGreenDeployment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BlueGreenDeployment: {
            type: "object",
            properties: {
              BlueGreenDeploymentIdentifier: {
                type: "string",
              },
              BlueGreenDeploymentName: {
                type: "string",
              },
              Source: {
                type: "string",
              },
              Target: {
                type: "string",
              },
              SwitchoverDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SourceMember: {
                      type: "string",
                    },
                    TargetMember: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Status: {
                type: "string",
              },
              StatusDetails: {
                type: "string",
              },
              CreateTime: {
                type: "string",
              },
              DeleteTime: {
                type: "string",
              },
              TagList: {
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
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Details about a blue/green deployment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteBlueGreenDeployment;
