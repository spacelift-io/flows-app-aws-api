import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DeregisterDBProxyTargetsCommand,
} from "@aws-sdk/client-rds";

const deregisterDBProxyTargets: AppBlock = {
  name: "Deregister DB Proxy Targets",
  description:
    "Remove the association between one or more DBProxyTarget data structures and a DBProxyTargetGroup.",
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

        const command = new DeregisterDBProxyTargetsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister DB Proxy Targets Result",
      description: "Result from DeregisterDBProxyTargets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deregisterDBProxyTargets;
