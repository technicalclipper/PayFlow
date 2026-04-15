> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Getting Started with the Developer-Controlled Wallets Node.js SDK

Use the
[Node.js SDK](https://www.npmjs.com/package/@circle-fin/developer-controlled-wallets)
to interact with
[Circle's Developer-Controlled Wallet APIs](/api-reference/wallets/developer-controlled-wallets/get-wallet-sets),
which allow you to embed secure wallets in your applications and create
blockchain transactions using the Developer Services platform.

This page provides short examples of how to install and use the
developer-controlled wallets SDK. For complete examples, see the
[Sample Projects](/sample-projects) page. For more information see the
[developer-controlled wallets documentation](/wallets/dev-controlled).

## Prerequisites

To use the Node.js SDK, ensure you have:

* [Node.js v22+](https://nodejs.org/) installed
* A [Circle Developer Console](https://console.circle.com) account
* An [API key](/build/keys) created in the Console:\
  **Keys → Create a key → API key → Standard Key**
* Your
  [Entity Secret registered](https://developers.circle.com/wallets/dev-controlled/register-entity-secret)

## Install the SDK

Use the following commands to install the SDK. You can
[view the package information on the npm site](https://www.npmjs.com/package/@circle-fin/developer-controlled-wallets).

<CodeGroup>
  ```shell npm theme={null}
  npm install @circle-fin/developer-controlled-wallets --save
  ```

  ```shell yarn theme={null}
  yarn add @circle-fin/developer-controlled-wallets
  ```
</CodeGroup>

## Developer-controlled wallets client

To start using the SDK, you first need to configure a client. Import the
`initiateDeveloperControlledWalletsClient` factory from the SDK, and then
initialize the client using your API key and entity secret.

### Import the client

The following example shows how to import the client and configure it to use
your API key and entity secret:

<CodeGroup>
  ```ts ES Module theme={null}
  import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: "<your-api-key>",
    entitySecret: "<your-entity-secret>",
  });
  ```

  ```ts CommonJS theme={null}
  const {
    initiateDeveloperControlledWalletsClient,
  } = require("@circle-fin/developer-controlled-wallets");
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: "<your-api-key>",
    entitySecret: "<your-entity-secret>",
  });
  ```
</CodeGroup>

### Create a wallet

The following example shows how to create a wallet using the client:

```ts TypeScript theme={null}
// Create a wallet set
const walletSetResponse = await client.createWalletSet({
  name: "Wallet Set 1",
});
console.log("Created WalletSet", walletSetResponse.data?.walletSet);

// Create a wallet on Arc Testnet
const walletsResponse = await client.createWallets({
  blockchains: ["ARC-TESTNET"],
  count: 1,
  walletSetId: walletSetResponse.data?.walletSet?.id ?? "",
});
console.log("Created Wallets", walletsResponse.data?.wallets);
```

### Create a transaction

The following example shows how to create a transaction using the client:

```ts TypeScript theme={null}
const response = await client.createTransaction({
  amounts: ["0.01"],
  destinationAddress: "0xa51c9c604b79a0fadbfed35dd576ca1bce71da0a",
  tokenId: "738c8a6d-8896-46d1-b2cb-083600c1c69b",
  walletId: "a635d679-4207-4e37-b12e-766afb9b3892",
  fee: { type: "level", config: { feeLevel: "HIGH" } },
});
console.log(response.data);
```

## Client configuration options

The client for the developer-controlled wallets SDK accepts the following
configuration parameters:

| **Option**     | **Required?** | **Description**                                                                                        |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `apiKey`       | Yes           | The API key used to authenticate requests to the Circle API.                                           |
| `entitySecret` | Yes           | Your configured entity secret.                                                                         |
| `storage`      | No            | Optional custom storage solution for persisting data. If not provided, the SDK uses in-memory storage. |



ENTITY SECRETS:
> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How-to: Register Your Entity Secret

> Create an Entity Secret and register its ciphertext to enable developer-wallet features using the Circle Wallets SDK.

In this guide, you learn how to generate, encrypt, and register an
<Tooltip tip="A 32-byte private key that secures your dev-controlled wallets. Circle never stores it, so you are responsible for keeping it safe.">Entity Secret</Tooltip>
using the Circle SDK. The SDK simplifies your development process by securely handling encryption, registration, and rotation of the Entity Secret that secures your dev-controlled wallets.

<Tip>
  Skip this guide if you already completed the [Create a Dev-Controlled
  Wallet](/wallets/dev-controlled/create-your-first-wallet) quickstart. You
  already registered an Entity Secret in your [Circle Developer
  Account](https://console.circle.com/) in that flow.
</Tip>

## Prerequisites

1. Create a
   [Circle Developer Account and an API key](/w3s/circle-developer-account).
2. Install the applicable server-side SDK for your language:

   <Tabs>
     <Tab title="Node.js">
       Use the following commands to install the SDK. You can
       [view the package information on the npm site](https://www.npmjs.com/package/@circle-fin/developer-controlled-wallets).

       <CodeGroup>
         ```shell npm theme={null}
         npm install @circle-fin/developer-controlled-wallets --save
         ```

         ```shell yarn theme={null}
         yarn add @circle-fin/developer-controlled-wallets
         ```
       </CodeGroup>

       For more information, visit the
       [Node.js SDK](/sdks/developer-controlled-wallets-nodejs-sdk).
     </Tab>

     <Tab title="Python">
       Use the following command to install the SDK with
       [pip](https://pypi.org/project/pip/):

       ```shell theme={null}
       pip install circle-developer-controlled-wallets
       ```

       For more information, visit the
       [Python SDK](/sdks/developer-controlled-wallets-python-sdk).
     </Tab>
   </Tabs>

<Note>
  If you are not using the Circle SDKs, you can generate and register your
  Entity Secret
  [manually](https://github.com/circlefin/w3s-entity-secret-sample-code) with
  standard libraries or CLI tools.
</Note>

## Introduction

The Entity Secret is a randomly generated 32-byte key used to secure
dev-controlled wallets. After generation, it is encrypted into ciphertext for
safe use in API requests. The ciphertext must be re-encrypted (rotated) whenever
required by API operations.

## 1. Generate an Entity Secret

Use the SDK to generate your Entity Secret. This creates a 32-byte hex string
and prints it in your terminal.

<CodeGroup>
  ```javascript Node.js SDK theme={null}
  import { generateEntitySecret } from "@circle-fin/developer-controlled-wallets";

  generateEntitySecret();
  ```

  ```python Python SDK theme={null}
  from circle.web3 import utils

  utils.generate_entity_secret()
  ```
</CodeGroup>

## 2. Register the Entity Secret

Register your Entity Secret with Circle using the SDK. Both the encryption of
the Entity Secret and its ciphertext registration is managed by the SDK
automatically.

<CodeGroup>
  ```ts Node.js SDK theme={null}
  import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

  const response = await registerEntitySecretCiphertext({
    apiKey:
      "****_API_KEY:5bef73***************d000:89a4aa************************b09",
    entitySecret: "ecd4d5e33b8e***************************************c546",
    recoveryFileDownloadPath: "",
  });
  console.log(response.data?.recoveryFile);
  ```

  ```python Python SDK theme={null}
  from circle.web3 import utils

  result = utils.register_entity_secret_ciphertext(
      api_key=
      '****_API_KEY:5bef73***************d000:89a4aa************************b09',
      entity_secret=
      'ecd4d5e33b8e***************************************c546',
      recoveryFileDownloadPath='')
  print(result)
  ```
</CodeGroup>

<Warning>
  **Secure Your Entity Secret and Recovery File**

  You are solely responsible for securing your Entity Secret and its recovery
  file. Failure to do so may result in the irreversible loss of access to your
  wallets and associated funds.

  * **Store your Entity Secret securely:** for example, in a password manager.
    This Entity Secret is required for future API calls.
  * **Save the recovery file** when registering your Entity Secret. Use the
    `recoveryFileDownloadPath` parameter in the SDK method and store the file in a
    safe, separate location. This file is the only way to reset your Entity Secret
    if it's lost.

  **Note:** Circle does not store your Entity Secret and cannot recover it for
  you.
</Warning>

## Final Considerations

Keep the following points in mind when using your registered Entity Secret:

* Each API request requires a new Entity Secret ciphertext. The SDK
  automatically re-encrypts the Entity Secret for each request when needed.
* Circle's
  [APIs Requiring Entity Secret Ciphertext](/wallets/dev-controlled/entity-secret-management#apis-requiring-entity-secret-ciphertext)
  enforce one-time-use ciphertexts to prevent replay attacks.
* Do not reuse ciphertexts across multiple API requests: reused ciphertexts will
  cause those requests to be rejected.

These practices ensure secure and compliant use of dev-controlled wallets.

<Note>
  The Entity Secret is associated with your Circle Console Account and is used
  to secure your dev-controlled wallets. It is not tied to individual API keys.
  API keys are used for authenticating your requests, while the Entity Secret is
  specifically for managing the security of your dev-controlled wallets.
</Note>


IN .ENV WE HAVE CIRLE WALLET API KEY NAMED AS CIRCLE_API_KEY