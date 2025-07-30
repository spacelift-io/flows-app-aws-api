import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, UpdateCustomKeyStoreCommand } from "@aws-sdk/client-kms";

const updateCustomKeyStore: AppBlock = {
  name: "Update Custom Key Store",
  description: "Changes the properties of a custom key store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CustomKeyStoreId: {
          name: "Custom Key Store Id",
          description:
            "Identifies the custom key store that you want to update.",
          type: "string",
          required: true,
        },
        NewCustomKeyStoreName: {
          name: "New Custom Key Store Name",
          description:
            "Changes the friendly name of the custom key store to the value that you specify.",
          type: "string",
          required: false,
        },
        KeyStorePassword: {
          name: "Key Store Password",
          description:
            "Enter the current password of the kmsuser crypto user (CU) in the CloudHSM cluster that is associated with the custom key store.",
          type: "string",
          required: false,
        },
        CloudHsmClusterId: {
          name: "Cloud Hsm Cluster Id",
          description:
            "Associates the custom key store with a related CloudHSM cluster.",
          type: "string",
          required: false,
        },
        XksProxyUriEndpoint: {
          name: "Xks Proxy Uri Endpoint",
          description:
            "Changes the URI endpoint that KMS uses to connect to your external key store proxy (XKS proxy).",
          type: "string",
          required: false,
        },
        XksProxyUriPath: {
          name: "Xks Proxy Uri Path",
          description:
            "Changes the base path to the proxy APIs for this external key store.",
          type: "string",
          required: false,
        },
        XksProxyVpcEndpointServiceName: {
          name: "Xks Proxy Vpc Endpoint Service Name",
          description:
            "Changes the name that KMS uses to identify the Amazon VPC endpoint service for your external key store proxy (XKS proxy).",
          type: "string",
          required: false,
        },
        XksProxyAuthenticationCredential: {
          name: "Xks Proxy Authentication Credential",
          description:
            "Changes the credentials that KMS uses to sign requests to the external key store proxy (XKS proxy).",
          type: {
            type: "object",
            properties: {
              AccessKeyId: {
                type: "string",
              },
              RawSecretAccessKey: {
                type: "string",
              },
            },
            required: ["AccessKeyId", "RawSecretAccessKey"],
            additionalProperties: false,
          },
          required: false,
        },
        XksProxyConnectivity: {
          name: "Xks Proxy Connectivity",
          description:
            "Changes the connectivity setting for the external key store.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateCustomKeyStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Custom Key Store Result",
      description: "Result from UpdateCustomKeyStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateCustomKeyStore;
