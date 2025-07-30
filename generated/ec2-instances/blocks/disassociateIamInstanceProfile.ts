import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateIamInstanceProfileCommand,
} from "@aws-sdk/client-ec2";

const disassociateIamInstanceProfile: AppBlock = {
  name: "Disassociate Iam Instance Profile",
  description:
    "Disassociates an IAM instance profile from a running or stopped instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description: "The ID of the IAM instance profile association.",
          type: "string",
          required: true,
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
        });

        const command = new DisassociateIamInstanceProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Iam Instance Profile Result",
      description: "Result from DisassociateIamInstanceProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IamInstanceProfileAssociation: {
            type: "object",
            properties: {
              AssociationId: {
                type: "string",
              },
              InstanceId: {
                type: "string",
              },
              IamInstanceProfile: {
                type: "object",
                properties: {
                  Arn: {
                    type: "string",
                  },
                  Id: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              State: {
                type: "string",
              },
              Timestamp: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Information about the IAM instance profile association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateIamInstanceProfile;
