import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyHostsCommand } from "@aws-sdk/client-ec2";

const modifyHosts: AppBlock = {
  name: "Modify Hosts",
  description: "Modify the auto-placement setting of a Dedicated Host.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostRecovery: {
          name: "Host Recovery",
          description:
            "Indicates whether to enable or disable host recovery for the Dedicated Host.",
          type: "string",
          required: false,
        },
        InstanceType: {
          name: "Instance Type",
          description:
            "Specifies the instance type to be supported by the Dedicated Host.",
          type: "string",
          required: false,
        },
        InstanceFamily: {
          name: "Instance Family",
          description:
            "Specifies the instance family to be supported by the Dedicated Host.",
          type: "string",
          required: false,
        },
        HostMaintenance: {
          name: "Host Maintenance",
          description:
            "Indicates whether to enable or disable host maintenance for the Dedicated Host.",
          type: "string",
          required: false,
        },
        HostIds: {
          name: "Host Ids",
          description: "The IDs of the Dedicated Hosts to modify.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        AutoPlacement: {
          name: "Auto Placement",
          description: "Specify whether to enable or disable auto-placement.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new ModifyHostsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Hosts Result",
      description: "Result from ModifyHosts operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The IDs of the Dedicated Hosts that were successfully modified.",
          },
          Unsuccessful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ResourceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The IDs of the Dedicated Hosts that could not be modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyHosts;
