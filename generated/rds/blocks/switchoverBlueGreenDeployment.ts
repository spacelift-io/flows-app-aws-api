import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  SwitchoverBlueGreenDeploymentCommand,
} from "@aws-sdk/client-rds";

const switchoverBlueGreenDeployment: AppBlock = {
  name: "Switchover Blue Green Deployment",
  description: "Switches over a blue/green deployment.",
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
          description: "The resource ID of the blue/green deployment.",
          type: "string",
          required: true,
        },
        SwitchoverTimeout: {
          name: "Switchover Timeout",
          description:
            "The amount of time, in seconds, for the switchover to complete.",
          type: "number",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new SwitchoverBlueGreenDeploymentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Switchover Blue Green Deployment Result",
      description: "Result from SwitchoverBlueGreenDeployment operation",
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

export default switchoverBlueGreenDeployment;
