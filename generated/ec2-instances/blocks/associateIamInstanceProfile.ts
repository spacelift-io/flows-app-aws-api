import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateIamInstanceProfileCommand,
} from "@aws-sdk/client-ec2";

const associateIamInstanceProfile: AppBlock = {
  name: "Associate Iam Instance Profile",
  description:
    "Associates an IAM instance profile with a running or stopped instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IamInstanceProfile: {
          name: "Iam Instance Profile",
          description: "The IAM instance profile.",
          type: {
            type: "object",
            properties: {
              Arn: {
                type: "string",
              },
              Name: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
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

        const command = new AssociateIamInstanceProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Iam Instance Profile Result",
      description: "Result from AssociateIamInstanceProfile operation",
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

export default associateIamInstanceProfile;
