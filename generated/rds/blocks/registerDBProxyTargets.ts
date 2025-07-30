import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, RegisterDBProxyTargetsCommand } from "@aws-sdk/client-rds";

const registerDBProxyTargets: AppBlock = {
  name: "Register DB Proxy Targets",
  description:
    "Associate one or more DBProxyTarget data structures with a DBProxyTargetGroup.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBProxyName: {
          name: "DB Proxy Name",
          description:
            "The identifier of the DBProxy that is associated with the DBProxyTargetGroup.",
          type: "string",
          required: true,
        },
        TargetGroupName: {
          name: "Target Group Name",
          description: "The identifier of the DBProxyTargetGroup.",
          type: "string",
          required: false,
        },
        DBInstanceIdentifiers: {
          name: "DB Instance Identifiers",
          description: "One or more DB instance identifiers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DBClusterIdentifiers: {
          name: "DB Cluster Identifiers",
          description: "One or more DB cluster identifiers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new RegisterDBProxyTargetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register DB Proxy Targets Result",
      description: "Result from RegisterDBProxyTargets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBProxyTargets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TargetArn: {
                  type: "string",
                },
                Endpoint: {
                  type: "string",
                },
                TrackedClusterId: {
                  type: "string",
                },
                RdsResourceId: {
                  type: "string",
                },
                Port: {
                  type: "number",
                },
                Type: {
                  type: "string",
                },
                Role: {
                  type: "string",
                },
                TargetHealth: {
                  type: "object",
                  properties: {
                    State: {
                      type: "string",
                    },
                    Reason: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "One or more DBProxyTarget objects that are created when you register targets with a target group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerDBProxyTargets;
