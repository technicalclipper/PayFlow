> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arc.network/llms.txt
> Use this file to discover all available pages before exploring further.

# Connect to Arc

> Connect your wallet or app to the Arc chain network.

## Network details

### Arc testnet

| Name             | Value                                                                                                                                                                                                                    |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Network**      | Arc Testnet                                                                                                                                                                                                              |
| **RPC endpoint** | `https://rpc.testnet.arc.network` <br /> Alternatives: <br />   • `https://rpc.blockdaemon.testnet.arc.network` <br />   • `https://rpc.drpc.testnet.arc.network` <br />   • `https://rpc.quicknode.testnet.arc.network` |
| **WebSocket**    | `wss://rpc.testnet.arc.network` <br /> Alternatives: <br />   • `wss://rpc.drpc.testnet.arc.network` <br />   • `wss://rpc.quicknode.testnet.arc.network`                                                                |
| **Chain ID**     | 5042002                                                                                                                                                                                                                  |
| **Currency**     | USDC                                                                                                                                                                                                                     |
| **Explorer**     | `https://testnet.arcscan.app`                                                                                                                                                                                            |
| **Faucet**       | `https://faucet.circle.com`                                                                                                                                                                                              |

## Wallet setup

### Add Arc testnet

1. Open MetaMask → **Add network** → **Add a network manually**.
2. Fill in:

| Field               | Value                             |
| :------------------ | :-------------------------------- |
| **Network name**    | Arc Testnet                       |
| **New RPC URL**     | `https://rpc.testnet.arc.network` |
| **Chain ID**        | 5042002                           |
| **Currency symbol** | USDC                              |
| **Explorer URL**    | `https://testnet.arcscan.app`     |

3. Save, then switch to Arc.

<Tip>
  If your wallet supports **custom gas tokens**, ensure display/decimals for
  USDC (18 decimals) and clearly label fees as USDC.
</Tip>

## Gas and fees

Arc uses USDC as the native gas token. For details on gas configuration and the
current base fee policy, see the [Gas and Fees](/arc/references/gas-and-fees)
page.



page 2

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arc.network/llms.txt
> Use this file to discover all available pages before exploring further.

# Deploy on Arc

> Learn how to deploy, test, and interact with a Solidity smart contract on the Arc Testnet.

<Info>
  Arc is currently in its testnet phase. During this period, the network may
  experience instability or unplanned downtime. **Note:** Throughout this page,
  all references to Arc refer specifically to the Arc Testnet.
</Info>

In this tutorial, you'll use Solidity and Foundry to write, deploy, and interact
with a simple smart contract on the Arc Testnet.

## What you'll learn

By the end of this tutorial, you'll be able to:

* Set up your development environment
* Configure Foundry to connect with Arc
* Implement your smart contract
* Deploy your contract to Arc Testnet
* Interact with your deployed contract

## Set up your development environment

Before you deploy to Arc, you need a working development environment. In this
step, you install [**Foundry**](https://getfoundry.sh/), a portable Ethereum
development toolkit, and initialize a new Solidity project.

1. Install Development Tools

```shell theme={null}
# Download foundry installer `foundryup`
curl -L https://foundry.paradigm.xyz | bash
```

2. Install binaries

```shell theme={null}
# Install forge, cast, anvil, chisel
foundryup
```

3. Initialize a new Solidity Project

```shell theme={null}
forge init hello-arc && cd hello-arc
```

## Configure Foundry to interact with Arc

In this step, you set up Foundry to connect to the Arc network by adding Arc's
RPC URLs to your project environment.

1. Create a `.env` file

Open the `hello-arc` project in your preferred code editor (for example, **VS
Code**). Then, create a new file named `.env` in the root of the project
directory.

2. Add the Arc Testnet RPC URL

Paste the following environment variable into the `.env` file:

```ini theme={null}
ARC_TESTNET_RPC_URL="https://rpc.testnet.arc.network"
```

This URL allows Foundry to connect to the Arc Testnet.

<Tip>
  Never commit your `.env` file to version control. Store private keys and
  sensitive variables securely.
</Tip>

## Implement your smart contract

In this step, you create the **HelloArchitect** contract, update the test and
script files, and compile the project.

<Info>
  **HelloArchitect** is a simple storage contract that manages a greeting
  message: it starts with a default greeting, lets you update it, and emits an
  event whenever the greeting changes.
</Info>

### 1. Write the HelloArchitect contract

First, delete the default `Counter.sol` template file from the `/src` directory:

```shell theme={null}
rm src/Counter.sol
```

Next, create a new file named `HelloArchitect.sol` inside the `/src` directory,
and add the following code:

```js theme={null}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract HelloArchitect {
    string private greeting;

    // Event emitted when the greeting is changed
    event GreetingChanged(string newGreeting);

    // Constructor that sets the initial greeting to "Hello Architect!"
    constructor() {
        greeting = "Hello Architect!";
    }

    // Setter function to update the greeting
    function setGreeting(string memory newGreeting) public {
        greeting = newGreeting;
        emit GreetingChanged(newGreeting);
    }

    // Getter function to return the current greeting
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
```

This contract includes a private `greeting` variable that stores the greeting
string, along with two public functions:

* `setGreeting` updates the `greeting` value and emits the `GreetingChanged`
  event
* `getGreeting` returns the current value of `greeting`

### 2. Update scripts and tests

Since you deleted `Counter.sol`, you need to remove or replace any scripts and
tests that reference it to avoid compilation errors.

**Delete the `script` directory**

The `script` directory includes files that reference `Counter.sol`. Since you've
removed `Counter.sol`, delete the entire `script` directory to avoid compilation
errors:

```shell theme={null}
rm -rf script
```

<Tip>
  You can recreate this directory later with updated deployment scripts for your
  own contracts.
</Tip>

**Replace `Counter.t.sol` with `HelloArchitect.t.sol`**

Navigate to the `/test` directory, delete the existing `Counter.t.sol` file, and
create a new test file named `HelloArchitect.t.sol`. Then, add the following
test cases to validate your contract:

```js theme={null}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/HelloArchitect.sol";

contract HelloArchitectTest is Test {
    HelloArchitect helloArchitect;

    function setUp() public {
        helloArchitect = new HelloArchitect();
    }

    function testInitialGreeting() public view {
        string memory expected = "Hello Architect!";
        string memory actual = helloArchitect.getGreeting();
        assertEq(actual, expected);
    }

    function testSetGreeting() public {
        string memory newGreeting = "Welcome to Arc Chain!";
        helloArchitect.setGreeting(newGreeting);
        string memory actual = helloArchitect.getGreeting();
        assertEq(actual, newGreeting);
    }

    function testGreetingChangedEvent() public {
        string memory newGreeting = "Building on Arc!";

        // Expect the GreetingChanged event to be emitted
        vm.expectEmit(true, true, true, true);
        emit HelloArchitect.GreetingChanged(newGreeting);

        helloArchitect.setGreeting(newGreeting);
    }
}
```

### 3. Test the contract

Run the following command to execute the contract's unit tests locally:

```shell theme={null}
forge test
```

This will compile the project, run the tests defined in `HelloArchitect.t.sol`,
and display the results in your terminal.

### 4. Compile the contract

To compile the **HelloArchitect** contract and generate build artifacts, run:

```shell theme={null}
forge build
```

This creates the `/out` directory containing the compiled bytecode and ABI,
which you'll use when deploying the contract.

## Deploy your contract to Arc testnet

In this step, you generate a wallet, fund it with testnet USDC (Arc's native gas
token), and deploy your smart contract to the Arc Testnet using Foundry.

### 1. Generate a wallet

To deploy the **HelloArchitect** contract, you need a funded wallet. Use the
Foundry command-line tool to generate a new wallet:

```shell theme={null}
cast wallet new
```

The command generates a new keypair and returns output similar to the following:

```text theme={null}
Successfully created new keypair.
Address:     0xB815A0c4bC23930119324d4359dB65e27A846A2d
Private key: 0xcc1b30a6af68ea9a9917f1dd••••••••••••••••••••••••••••••••••••••97c5
```

<Warning>
  **Important:** Keep your private key secure. Never share it or commit it to
  source control.
</Warning>

Add your private key to your `.env` file:

```ini theme={null}
PRIVATE_KEY="0x..."
```

Reload your environment variables:

```shell theme={null}
source .env
```

### 2. Fund your wallet

Visit the [Circle Faucet](https://faucet.circle.com), select **Arc Testnet**,
paste your wallet address, and request testnet USDC.

Since USDC is Arc's native gas token, this will provide the funds needed to
cover gas fees when deploying your contract.

<Info>
  Testnet USDC is for testing purposes only. It has no real-world value and must
  not be used in production.
</Info>

### 3. Deploy the contract

With your wallet funded with testnet USDC, deploy the **HelloArchitect**
contract to the Arc Testnet using the Foundry command-line tool:

```shell theme={null}
forge create src/HelloArchitect.sol:HelloArchitect \
  --rpc-url $ARC_TESTNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

<Warning>
  **Important:** Never expose your real private key in production. Use
  environment variables or secrets management in real deployments.
</Warning>

After the contract is deployed successfully, you should see output similar to
this:

```text theme={null}
Compiler run successful!
Deployer: 0xB815A0c4bC23930119324d4359dB65e27A846A2d
Deployed to: 0x32368037b14819C9e5Dbe96b3d67C59b8c65c4BF
Transaction hash: 0xeba0fcb5e528d586db0aeb2465a8fad0299330a9773ca62818a1827560a67346
```

### 4. Store the contract address

Copy the deployed contract address from the `Deployed to:` line and save it to
your `.env` file:

```ini theme={null}
HELLOARCHITECT_ADDRESS="0x..."
```

Reload your environment variables again:

```shell theme={null}
source .env
```

## Interact with your deployed contract

In this step, you verify that the deployment succeeded by checking the
transaction in the Arc Testnet Explorer, then use `cast` to call a function from
your contract.

### 1. Check transaction on the explorer

Open the [Arc Testnet Explorer](https://testnet.arcscan.app), and paste the
**transaction hash** from the deployment output. This lets you view the
transaction details and confirm that the contract was deployed successfully.

### 2. Use `cast` to call a contract function

Use the `cast call` command to interact with your deployed contract from the
command line. Run the following:

```shell theme={null}
cast call $HELLOARCHITECT_ADDRESS "getGreeting()(string)" \
  --rpc-url $ARC_TESTNET_RPC_URL
```

The command calls the `getGreeting` function on the **HelloArchitect** contract
and returns the current value of the `greeting` variable.

## Next steps

Congratulations, you've deployed and interacted with your first contract on Arc
Testnet. From here, you can:

* Extend the **HelloArchitect** contract with more logic for additional
  features.
* Explore Arc's stablecoin-native features like USDC as gas and deterministic
  finality
* Build more advanced applications for payments, FX, or tokenized assets


Deploy contracts

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arc.network/llms.txt
> Use this file to discover all available pages before exploring further.

# Deploy contracts

> Deploy pre-audited smart contract templates on Arc with Circle Contracts.

This tutorial guides you through deploying smart contracts on Arc Testnet with
[Circle Contracts](https://developers.circle.com/contracts/scp-templates-overview).
You'll create a
[Circle Dev-Controlled SCA Wallet](https://developers.circle.com/wallets/dev-controlled),
then deploy pre-audited contract templates (ERC-20, ERC-721, ERC-1155, Airdrop).
With SCA wallets,
[Circle Gas Station](https://developers.circle.com/wallets/gas-station)
automatically sponsors your transaction fees on Arc Testnet.

These pre-audited templates represent building blocks: ERC-20 for money and
liquidity, ERC-721 for identity and unique rights, ERC-1155 for scalable
financial instruments, and Airdrops for distributing incentives. To learn more
about available templates, visit the
[Templates Overview](https://developers.circle.com/contracts/scp-templates-overview)
to review all templates and their options.

## Prerequisites

To complete this tutorial, you need:

1. [Node.js v22+](https://nodejs.org/) installed
2. **Circle Developer Account** - [Sign up](https://console.circle.com/) on the
   Developer Console
3. **API Key** - Create in the Console: **Keys → Create a key → API key →
   Standard Key**
4. **Entity Secret** - Required to initialize the Circle Dev-Controlled Wallets
   SDK. Learn how to
   [register your Entity Secret](https://developers.circle.com/wallets/dev-controlled/register-entity-secret)

## Step 1. Set up your project

Before deploying any template, you need a working project and a funded
dev-controlled wallet on Arc Testnet. Complete the steps in this section once.
Then reuse the same wallet and credentials across all template deployments
below.

### 1.1. Create the project and install dependencies

Create a new directory. Navigate to it and start a new project with default
settings.

<CodeGroup>
  ```shell Node.js theme={null}
  mkdir hello-arc
  cd hello-arc
  npm init -y
  npm pkg set type=module

  # Add run scripts for wallet creation and contract deployment
  npm pkg set scripts.create-wallet="tsx --env-file=.env create-wallet.ts"
  npm pkg set scripts.deploy-erc20="tsx --env-file=.env deploy-erc20.ts"
  npm pkg set scripts.deploy-erc721="tsx --env-file=.env deploy-erc721.ts"
  npm pkg set scripts.deploy-erc1155="tsx --env-file=.env deploy-erc1155.ts"
  npm pkg set scripts.deploy-airdrop="tsx --env-file=.env deploy-airdrop.ts"
  ```

  ```shell Python theme={null}
  mkdir hello-arc
  cd hello-arc
  python3 -m venv .venv
  source .venv/bin/activate
  ```
</CodeGroup>

In the project directory, install the
[Circle Dev-Controlled Wallets SDK](https://developers.circle.com/wallets/dev-controlled)
and the [Circle Contracts SDK](https://developers.circle.com/sdks).
Dev-Controlled Wallets are Circle-managed wallets that your app controls via
APIs. You can deploy contracts and submit transactions without managing private
keys directly. You can also call the
[Circle Wallets API](https://developers.circle.com/api-reference/wallets/) and
[Circle Contracts API](https://developers.circle.com/api-reference/contracts/)
directly if you can't use the SDKs in your project.

<CodeGroup>
  ```shell Node.js theme={null}
  npm install @circle-fin/developer-controlled-wallets @circle-fin/smart-contract-platform
  npm install --save-dev tsx typescript @types/node
  ```

  ```shell Python theme={null}
  pip install circle-smart-contract-platform circle-developer-controlled-wallets
  ```
</CodeGroup>

### 1.2. Configure TypeScript (optional)

Create a `tsconfig.json` file:

<CodeGroup>
  ```shell Node.js theme={null}
  npx tsc --init
  ```
</CodeGroup>

Then, edit the `tsconfig.json` file:

<CodeGroup>
  ```shell Node.js theme={null}
  cat <<'EOF' > tsconfig.json
  {
    "compilerOptions": {
      "target": "ESNext",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "strict": true,
      "types": ["node"]
    }
  }
  EOF
  ```
</CodeGroup>

### 1.3. Set environment variables

Create a `.env` file in the project directory with your Circle credentials.
Replace these placeholders with your own credentials:

```text .env theme={null}
CIRCLE_API_KEY=YOUR_API_KEY
CIRCLE_ENTITY_SECRET=YOUR_ENTITY_SECRET
CIRCLE_WEB3_API_KEY=YOUR_API_KEY
```

* `CIRCLE_API_KEY` is your Circle Developer API key for Wallets and Contracts
  API requests.
* `CIRCLE_ENTITY_SECRET` is your registered entity secret used to authorize
  developer-controlled wallet operations.
* `CIRCLE_WEB3_API_KEY` is the Python SDK compatibility variable and should use
  the same value as `CIRCLE_API_KEY`.

The npm run commands in this tutorial load variables from `.env` using Node.js
native env-file support.

<Tip>
  Prefer editing `.env` files in your IDE or editor so credentials are not
  leaked to your shell history.
</Tip>

<Warning>
  This tutorial adds runtime values such as wallet IDs, transaction IDs, and
  contract IDs later in the flow. Keep those derived values aligned with the
  script outputs as you progress through the deployment steps.
</Warning>

## Step 2. Set up your wallet

In this step, you create a dev-controlled wallet and fund it for contract
deployment on Arc Testnet. If you already have a funded Arc Testnet
dev-controlled wallet, skip to
[the contract templates section](#deploy-an-erc-20-contract).

### 2.1. Create a wallet

Import the Wallets SDK and start the client with your API key and Entity Secret.
Dev-controlled wallets are created in a
[wallet set](https://developers.circle.com/wallets/dev-controlled/create-your-first-wallet#1-create-a-wallet-set).
The wallet set is the source from which wallet keys are derived.

<CodeGroup>
  ```ts create-wallet.ts theme={null}
  import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  // Create a wallet set
  const walletSetResponse = await client.createWalletSet({
    name: "Wallet Set 1",
  });

  // Create a wallet on Arc Testnet
  const walletsResponse = await client.createWallets({
    blockchains: ["ARC-TESTNET"],
    count: 1,
    walletSetId: walletSetResponse.data?.walletSet?.id ?? "",
    accountType: "SCA",
  });

  console.log(JSON.stringify(walletsResponse.data, null, 2));
  ```

  ```python create_wallet.py theme={null}
  from circle.web3 import utils, developer_controlled_wallets
  import os
  import json

  client = utils.init_developer_controlled_wallets_client(
      api_key=os.getenv("CIRCLE_API_KEY"),
      entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
  )

  wallet_sets_api = developer_controlled_wallets.WalletSetsApi(client)
  wallets_api = developer_controlled_wallets.WalletsApi(client)

  # Create a wallet set
  wallet_set = wallet_sets_api.create_wallet_set(
      developer_controlled_wallets.CreateWalletSetRequest.from_dict({
          "name": "Wallet Set 1"
      })
  )

  # Create a wallet on Arc testnet
  wallet = wallets_api.create_wallet(
      developer_controlled_wallets.CreateWalletRequest.from_dict({
          "blockchains": ["ARC-TESTNET"],
          "count": 1,
          "walletSetId": wallet_set.data.wallet_set.actual_instance.id,
          "accountType": "SCA"
      })
  )

  print(json.dumps(wallet.data.to_dict(), indent=2))
  ```
</CodeGroup>

**Run the script:**

<CodeGroup>
  ```shell Node.js theme={null}
  npm run create-wallet
  ```

  ```shell Python theme={null}
  python create_wallet.py
  ```
</CodeGroup>

**Response:**

<Note>
  If you're calling the API directly, you'll need two requests. One to [create
  the wallet
  set](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/create-wallet-set).
  One to [create the
  wallet](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/create-wallet).

  Be sure to replace the
  [Entity Secret ciphertext](https://developers.circle.com/wallets/dev-controlled/entity-secret-management#what-is-an-entity-secret-ciphertext)
  and the idempotency key in your request. If you're using the SDKs, this is
  handled for you.
</Note>

You should now have a newly created dev-controlled wallet. The API response will
look similar to the following:

```json theme={null}
{
  "wallets": [
    {
      "id": "45692c3e-2ffa-5c5b-a99c-61366939114c",
      "state": "LIVE",
      "walletSetId": "ee58db40-22b4-55cb-9ce6-3444cb6efd2f",
      "custodyType": "DEVELOPER",
      "address": "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
      "blockchain": "ARC-TESTNET",
      "accountType": "SCA",
      "updateDate": "2026-01-20T09:39:16Z",
      "createDate": "2026-01-20T09:39:16Z",
      "scaCore": "circle_6900_singleowner_v3"
    }
  ]
}
```

<Note>
  **Why SCA wallets?** Smart Contract Accounts (SCA) on Arc Testnet work with
  [Gas Station](https://developers.circle.com/wallets/gas-station) to
  automatically sponsor transaction fees. Learn more about [Gas Station policies
  and setup](https://developers.circle.com/wallets/gas-station).
</Note>

***

<Tabs>
  <Tab title="ERC-20">
    ## Deploy an ERC-20 contract

    ERC-20 is the standard for fungible tokens. Use this template for tokenized
    assets, treasury instruments, governance tokens, or programmable money.

    ### Step 3: Prepare for deployment

    #### 3.1. Get your wallet information

    Retrieve your wallet ID from Step 2. Ensure:

    * Wallet custody type is **Dev-Controlled**
    * Blockchain is **Arc Testnet**
    * Account type is **SCA** (Smart Contract Account, recommended for Gas Station
      compatibility)

    Note your wallet's address for subsequent steps.

    #### 3.2. Understand deployment parameters

    | Parameter                | Description                                                                                                                                                      |
    | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `idempotencyKey`         | A unique value to prevent duplicate requests.                                                                                                                    |
    | `name`                   | The offchain contract name (visible in Circle Console only). Use `MyTokenContract`.                                                                              |
    | `walletId`               | The ID of the wallet deploying the contract. Use your dev-controlled wallet ID.                                                                                  |
    | `templateId`             | The template identifier. Use `a1b74add-23e0-4712-88d1-6b3009e85a86` for ERC-20. See [Templates](https://developers.circle.com/contracts/scp-templates-overview). |
    | `blockchain`             | The network to deploy onto. Use `ARC-TESTNET`.                                                                                                                   |
    | `entitySecretCiphertext` | The re-encrypted entity secret. See [Entity Secret Management](https://developers.circle.com/wallets/dev-controlled/entity-secret-management).                   |
    | `feeLevel`               | The fee level for transaction processing. Use `MEDIUM`.                                                                                                          |
    | `templateParameters`     | The onchain initialization parameters (see below).                                                                                                               |

    #### 3.3. Template parameters

    **Required Parameters:**

    | Parameter              | Type   | Description                                                                         |
    | :--------------------- | :----- | :---------------------------------------------------------------------------------- |
    | `name`                 | String | The onchain contract name. Use `MyToken`.                                           |
    | `defaultAdmin`         | String | The address with administrator permissions. Use your Dev-Controlled Wallet address. |
    | `primarySaleRecipient` | String | The address that receives proceeds from first-time sales. Use your wallet address.  |

    **Optional Parameters:**

    | Parameter              | Type       | Description                                                                                                |
    | :--------------------- | :--------- | :--------------------------------------------------------------------------------------------------------- |
    | `symbol`               | String     | The token symbol (for example, `MTK`).                                                                     |
    | `platformFeeRecipient` | String     | The address that receives platform fees from sales. Set this when implementing platform fee revenue share. |
    | `platformFeePercent`   | Float      | The platform fee percentage as decimal (for example, `0.1` for 10%). Requires `platformFeeRecipient`.      |
    | `contractUri`          | String     | The URL for the contract metadata.                                                                         |
    | `trustedForwarders`    | Strings\[] | A list of addresses that can forward ERC2771 meta-transactions to this contract.                           |

    ### Step 4: Deploy the smart contract

    Deploy by making a request to
    [`POST /templates/{id}/deploy`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/deploy-contract-template):

    <CodeGroup>
      ```ts deploy-erc20.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const response = await circleContractSdk.deployContractTemplate({
        id: "a1b74add-23e0-4712-88d1-6b3009e85a86",
        blockchain: "ARC-TESTNET",
        name: "MyTokenContract",
        walletId: process.env.WALLET_ID,
        templateParameters: {
          name: "MyToken",
          symbol: "MTK",
          defaultAdmin: process.env.WALLET_ADDRESS,
          primarySaleRecipient: process.env.WALLET_ADDRESS,
        },
        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM",
          },
        },
      });

      console.log(JSON.stringify(response.data, null, 2));
      ```

      ```python deploy_erc20.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      import os
      import json

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.TemplatesApi(scpClient)

      request = smart_contract_platform.TemplateContractDeploymentRequest.from_dict({
          "blockchain": "ARC-TESTNET",
          "name": "MyTokenContract",
          "walletId": os.getenv("WALLET_ID"),
          "templateParameters": {
              "name": "MyToken",
              "symbol": "MTK",
              "defaultAdmin": os.getenv("WALLET_ADDRESS"),
              "primarySaleRecipient": os.getenv("WALLET_ADDRESS"),
          },
          "feeLevel": "MEDIUM"
      })

      response = api_instance.deploy_contract_template("a1b74add-23e0-4712-88d1-6b3009e85a86", request)

      print(json.dumps(response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url https://api.circle.com/v1/w3s/templates/a1b74add-23e0-4712-88d1-6b3009e85a86/deploy \
        --header 'Authorization: Bearer <API_KEY>' \
        --header 'Content-Type: application/json' \
        --data '
      {
        "idempotencyKey": "<string>",
        "entitySecretCiphertext": "<string>",
        "blockchain": "ARC-TESTNET",
        "walletId": "<WALLET_ID>",
        "name": "MyTokenContract",
        "templateParameters": {
          "name": "MyToken",
          "symbol": "MTK",
          "defaultAdmin": "<DEFAULT_ADMIN_ADDRESS>",
          "primarySaleRecipient": "<PRIMARY_SALE_ADDRESS>"
        },
        "feeLevel": "MEDIUM"
      }
      '
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run deploy-erc20
      ```

      ```shell Python theme={null}
      python deploy_erc20.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contractIds": ["019c053d-1ed1-772b-91a8-6970003dad8d"],
      "transactionId": "5b6185b2-f9a1-5645-9db2-ca5d9a330794"
    }
    ```

    <Note>
      A successful response indicates deployment has been **initiated**, not
      completed. Use the `transactionId` to check the deployment status in the next
      step.
    </Note>

    #### 4.1. Check deployment status

    You can check the status of the deployment from the
    [Circle Developer Console](https://console.circle.com/smart-contracts/contracts)
    or by calling
    [`GET /transactions/{id}`](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/get-transaction).

    After running the deployment script, copy the `transactionId` from the response
    and update your `.env` file with `TRANSACTION_ID={your-transaction-id}`. Then
    run the check-transaction script to verify deployment status.

    <CodeGroup>
      ```ts check-transaction.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const transactionResponse = await circleDeveloperSdk.getTransaction({
        id: process.env.TRANSACTION_ID!,
      });

      console.log(JSON.stringify(transactionResponse.data, null, 2));
      ```

      ```python check_transaction.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)
      transaction_response = api_instance.get_transaction(
          id=os.getenv("TRANSACTION_ID")
      )

      print(json.dumps(transaction_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm pkg set scripts.check-transaction="tsx --env-file=.env check-transaction.ts"
      npm run check-transaction
      ```

      ```shell Python theme={null}
      python check_transaction.py
      ```
    </CodeGroup>

    <Note>
      Transaction status may show PENDING immediately after deployment. Wait 10-30
      seconds and re-run check-transaction to see COMPLETE status.
    </Note>

    **Response:**

    ```json theme={null}
    {
      "transaction": {
        "id": "601a0815-f749-41d8-b193-22cadd2a8977",
        "blockchain": "ARC-TESTNET",
        "walletId": "45692c3e-2ffa-5c5b-a99c-61366939114c",
        "sourceAddress": "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
        "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
        "transactionType": "OUTBOUND",
        "custodyType": "DEVELOPER",
        "state": "COMPLETE",
        "amounts": [],
        "nfts": null,
        "txHash": "0x3bfbab5d5ce0d1a5d682cbc742d3940cf59db0369d173b71ba2a3b8f43bfbcb1",
        "blockHash": "0x7d12148f9331556b31f84f58a41b7ff16eaaa47940f9e86733037d7ab74d858e",
        "blockHeight": 23686153,
        "userOpHash": "0x66befac1a371fcdddf1566215e4677127e111dff9253f306f7096fed8642a208",
        "networkFee": "0.044628774800664",
        "firstConfirmDate": "2026-01-26T08:59:56Z",
        "operation": "CONTRACT_EXECUTION",
        "feeLevel": "MEDIUM",
        "estimatedFee": {
          "gasLimit": "500797",
          "networkFee": "0.16506442157883425",
          "baseFee": "160",
          "priorityFee": "9.60345525",
          "maxFee": "329.60345525"
        },
        "refId": "",
        "abiFunctionSignature": "mintTo(address,uint256)",
        "abiParameters": [
          "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
          "1000000000000000000"
        ],
        "createDate": "2026-01-26T08:59:54Z",
        "updateDate": "2026-01-26T08:59:56Z"
      }
    }
    ```

    #### 4.2. Get the contract address

    After deployment completes, retrieve the contract address using
    [`GET /contracts/{id}`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/get-contract).

    After deployment completes, copy the `contractIds[0]` from the deployment
    response and update your `.env` file with `CONTRACT_ID={your-contract-id}`. Then
    run the get-contract script to retrieve the contract address.

    <CodeGroup>
      ```ts get-contract.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const contractResponse = await circleContractSdk.getContract({
        id: process.env.CONTRACT_ID!,
      });

      console.log(JSON.stringify(contractResponse.data, null, 2));
      ```

      ```python get_contract.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.ViewUpdateApi(scpClient)
      contract_response = api_instance.get_contract(
          id=os.getenv("CONTRACT_ID")
      )

      print(json.dumps(contract_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm pkg set scripts.get-contract="tsx --env-file=.env get-contract.ts"
      npm run get-contract
      ```

      ```shell Python theme={null}
      python get_contract.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contract": {
        "id": "b7c35372-ce69-4ccd-bfaa-504c14634f0d",
        "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "blockchain": "ARC-TESTNET",
        "status": "COMPLETE"
      }
    }
    ```

    Once your contract is deployed, you can interact with it from your application.
    You'll be able to view the contract both in the
    [Circle Developer Console](https://console.circle.com/smart-contracts/contracts)
    and on the [Arc Testnet Explorer](https://testnet.arcscan.app/).

    <Note>
      **Initial Supply:** The contract starts with 0 token supply at deployment. Use
      the `mintTo` function to create tokens and assign them to addresses as needed.
    </Note>

    ***
  </Tab>

  <Tab title="ERC-721">
    ## Deploy an ERC-721 contract

    ERC-721 is the standard for unique digital assets. Use this template for
    ownership certificates, tokenized assets, unique financial instruments, or
    distinct asset representation.

    ### Step 3: Prepare for deployment

    #### 3.1. Get your wallet information

    Retrieve your wallet ID from Step 2. Ensure:

    * Wallet custody type is **Dev-Controlled**
    * Blockchain is **Arc Testnet**
    * Account type is **SCA** (Smart Contract Account, recommended for Gas Station
      compatibility)

    Note your wallet's address for subsequent steps.

    #### 3.2. Understand deployment parameters

    | Parameter                | Description                                                                                                                                                       |
    | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `idempotencyKey`         | A unique value to prevent duplicate requests.                                                                                                                     |
    | `name`                   | The offchain contract name (visible in Circle Console only). Use `MyTokenContract`.                                                                               |
    | `walletId`               | The ID of the wallet deploying the contract. Use your dev-controlled wallet ID.                                                                                   |
    | `templateId`             | The template identifier. Use `76b83278-50e2-4006-8b63-5b1a2a814533` for ERC-721. See [Templates](https://developers.circle.com/contracts/scp-templates-overview). |
    | `blockchain`             | The network to deploy onto. Use `ARC-TESTNET`.                                                                                                                    |
    | `entitySecretCiphertext` | The re-encrypted entity secret. See [Entity Secret Management](https://developers.circle.com/wallets/dev-controlled/entity-secret-management).                    |
    | `feeLevel`               | The fee level for transaction processing. Use `MEDIUM`.                                                                                                           |
    | `templateParameters`     | The onchain initialization parameters (see below).                                                                                                                |

    #### 3.3. Template parameters

    **Required Parameters:**

    | Parameter              | Type   | Description                                                                         |
    | :--------------------- | :----- | :---------------------------------------------------------------------------------- |
    | `name`                 | String | The onchain contract name. Use `MyToken`.                                           |
    | `defaultAdmin`         | String | The address with administrator permissions. Use your Dev-Controlled Wallet address. |
    | `primarySaleRecipient` | String | The address for first-time sale proceeds. Use your Dev-Controlled Wallet address.   |
    | `royaltyRecipient`     | String | The address for secondary sale royalties. Use your Dev-Controlled Wallet address.   |
    | `royaltyPercent`       | Float  | The royalty share as a decimal (for example, `0.01` for 1%). Use `0.01`.            |

    **Optional Parameters:**

    | Parameter              | Type       | Description                                                                                                |
    | :--------------------- | :--------- | :--------------------------------------------------------------------------------------------------------- |
    | `symbol`               | String     | The token symbol (for example, `MTK`).                                                                     |
    | `platformFeeRecipient` | String     | The address that receives platform fees from sales. Set this when implementing platform fee revenue share. |
    | `platformFeePercent`   | Float      | The platform fee percentage as decimal (for example, `0.1` for 10%). Requires `platformFeeRecipient`.      |
    | `contractUri`          | String     | The URL for the contract metadata.                                                                         |
    | `trustedForwarders`    | Strings\[] | A list of addresses that can forward ERC2771 meta-transactions to this contract.                           |

    ### Step 4: Deploy the smart contract

    Deploy by making a request to
    [`POST /templates/{id}/deploy`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/deploy-contract-template):

    <CodeGroup>
      ```ts deploy-erc721.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const response = await circleContractSdk.deployContractTemplate({
        id: "76b83278-50e2-4006-8b63-5b1a2a814533",
        blockchain: "ARC-TESTNET",
        name: "MyTokenContract",
        walletId: process.env.WALLET_ID,
        templateParameters: {
          name: "MyToken",
          symbol: "MTK",
          defaultAdmin: process.env.WALLET_ADDRESS,
          primarySaleRecipient: process.env.WALLET_ADDRESS,
          royaltyRecipient: process.env.WALLET_ADDRESS,
          royaltyPercent: 0.01,
        },
        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM",
          },
        },
      });

      console.log(JSON.stringify(response.data, null, 2));
      ```

      ```python deploy_erc721.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      import os
      import json

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.TemplatesApi(scpClient)

      request = smart_contract_platform.TemplateContractDeploymentRequest.from_dict({
          "blockchain": "ARC-TESTNET",
          "name": "MyTokenContract",
          "walletId": os.getenv("WALLET_ID"),
          "templateParameters": {
              "name": "MyToken",
              "symbol": "MTK",
              "defaultAdmin": os.getenv("WALLET_ADDRESS"),
              "primarySaleRecipient": os.getenv("WALLET_ADDRESS"),
              "royaltyRecipient": os.getenv("WALLET_ADDRESS"),
              "royaltyPercent": "0.01",
          },
          "feeLevel": "MEDIUM"
      })

      request.template_parameters["royaltyPercent"] = 0.01

      response = api_instance.deploy_contract_template("76b83278-50e2-4006-8b63-5b1a2a814533", request)

      print(json.dumps(response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url https://api.circle.com/v1/w3s/templates/76b83278-50e2-4006-8b63-5b1a2a814533/deploy \
        --header 'Authorization: Bearer <API_KEY>' \
        --header 'Content-Type: application/json' \
        --data '
      {
        "idempotencyKey": "<string>",
        "entitySecretCiphertext": "<string>",
        "blockchain": "ARC-TESTNET",
        "walletId": "<WALLET_ID>",
        "name": "MyTokenContract",
        "templateParameters": {
          "name": "MyToken",
          "symbol": "MTK",
          "defaultAdmin": "<WALLET_ADDRESS>",
          "primarySaleRecipient": "<WALLET_ADDRESS>",
          "royaltyRecipient": "<WALLET_ADDRESS>",
          "royaltyPercent": 0.01
        },
        "feeLevel": "MEDIUM"
      }
      '
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run deploy-erc721
      ```

      ```shell Python theme={null}
      python deploy_erc721.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contractIds": ["019c053d-1ed1-772b-91a8-6970003dad8d"],
      "transactionId": "5b6185b2-f9a1-5645-9db2-ca5d9a330794"
    }
    ```

    <Note>
      A successful response indicates deployment has been **initiated**, not
      completed. Use the `transactionId` to check the deployment status in the next
      step.
    </Note>

    #### 4.1. Check deployment status

    Verify deployment with
    [`GET /transactions/{id}`](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/get-transaction).

    After running the deployment script, copy the `transactionId` from the response
    and update your `.env` file with `TRANSACTION_ID={your-transaction-id}`. Then
    run the check-transaction script to verify deployment status.

    <CodeGroup>
      ```ts check-transaction.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const transactionResponse = await circleDeveloperSdk.getTransaction({
        id: process.env.TRANSACTION_ID!,
      });

      console.log(JSON.stringify(transactionResponse.data, null, 2));
      ```

      ```python check_transaction.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)
      transaction_response = api_instance.get_transaction(
          id=os.getenv("TRANSACTION_ID")
      )

      print(json.dumps(transaction_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run check-transaction
      ```

      ```shell Python theme={null}
      python check_transaction.py
      ```
    </CodeGroup>

    <Note>
      Transaction status may show PENDING immediately after deployment. Wait 10-30
      seconds and re-run check-transaction to see COMPLETE status.
    </Note>

    **Response:**

    ```json theme={null}
    {
      "transaction": {
        "id": "601a0815-f749-41d8-b193-22cadd2a8977",
        "blockchain": "ARC-TESTNET",
        "walletId": "45692c3e-2ffa-5c5b-a99c-61366939114c",
        "sourceAddress": "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
        "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
        "transactionType": "OUTBOUND",
        "custodyType": "DEVELOPER",
        "state": "COMPLETE",
        "amounts": [],
        "nfts": null,
        "txHash": "0x3bfbab5d5ce0d1a5d682cbc742d3940cf59db0369d173b71ba2a3b8f43bfbcb1",
        "blockHash": "0x7d12148f9331556b31f84f58a41b7ff16eaaa47940f9e86733037d7ab74d858e",
        "blockHeight": 23686153,
        "userOpHash": "0x66befac1a371fcdddf1566215e4677127e111dff9253f306f7096fed8642a208",
        "networkFee": "0.044628774800664",
        "firstConfirmDate": "2026-01-26T08:59:56Z",
        "operation": "CONTRACT_EXECUTION",
        "feeLevel": "MEDIUM",
        "estimatedFee": {
          "gasLimit": "500797",
          "networkFee": "0.16506442157883425",
          "baseFee": "160",
          "priorityFee": "9.60345525",
          "maxFee": "329.60345525"
        },
        "refId": "",
        "abiFunctionSignature": "mintTo(address,uint256)",
        "abiParameters": [
          "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
          "1000000000000000000"
        ],
        "createDate": "2026-01-26T08:59:54Z",
        "updateDate": "2026-01-26T08:59:56Z"
      }
    }
    ```

    #### 4.2. Get the contract address

    After deployment completes, retrieve the contract address using
    [`GET /contracts/{id}`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/get-contract).

    After deployment completes, copy the `contractIds[0]` from the deployment
    response and update your `.env` file with `CONTRACT_ID={your-contract-id}`. Then
    run the get-contract script to retrieve the contract address.

    <CodeGroup>
      ```ts get-contract.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const contractResponse = await circleContractSdk.getContract({
        id: process.env.CONTRACT_ID!,
      });

      console.log(JSON.stringify(contractResponse.data, null, 2));
      ```

      ```python get_contract.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.ViewUpdateApi(scpClient)
      contract_response = api_instance.get_contract(
          id=os.getenv("CONTRACT_ID")
      )

      print(json.dumps(contract_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run get-contract
      ```

      ```shell Python theme={null}
      python get_contract.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contract": {
        "id": "b7c35372-ce69-4ccd-bfaa-504c14634f0d",
        "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "blockchain": "ARC-TESTNET",
        "status": "COMPLETE"
      }
    }
    ```

    ***
  </Tab>

  <Tab title="ERC-1155">
    ## Deploy an ERC-1155 contract

    ERC-1155 is the standard for multi-asset token management. Use this template for
    structured products, tiered assets, batch settlements, or managing diverse asset
    portfolios.

    ### Step 3: Prepare for deployment

    #### 3.1. Get your wallet information

    Retrieve your wallet ID from Step 2. Ensure:

    * Wallet custody type is **Dev-Controlled**
    * Blockchain is **Arc Testnet**
    * Account type is **SCA** (Smart Contract Account, recommended for Gas Station
      compatibility)

    Note your wallet's address for subsequent steps.

    #### 3.2. Understand deployment parameters

    | Parameter                | Description                                                                                                                                                        |
    | :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `idempotencyKey`         | A unique value to prevent duplicate requests.                                                                                                                      |
    | `name`                   | The offchain contract name (visible in Circle Console only). Use `MyMultiTokenContract`.                                                                           |
    | `walletId`               | The ID of the wallet deploying the contract. Use your dev-controlled wallet ID.                                                                                    |
    | `templateId`             | The template identifier. Use `aea21da6-0aa2-4971-9a1a-5098842b1248` for ERC-1155. See [Templates](https://developers.circle.com/contracts/scp-templates-overview). |
    | `blockchain`             | The network to deploy onto. Use `ARC-TESTNET`.                                                                                                                     |
    | `entitySecretCiphertext` | The re-encrypted entity secret. See [Entity Secret Management](https://developers.circle.com/wallets/dev-controlled/entity-secret-management).                     |
    | `feeLevel`               | The fee level for transaction processing. Use `MEDIUM`.                                                                                                            |
    | `templateParameters`     | The onchain initialization parameters (see below).                                                                                                                 |

    #### 3.3. Template parameters

    **Required Parameters:**

    | Parameter              | Type   | Description                                                                         |
    | :--------------------- | :----- | :---------------------------------------------------------------------------------- |
    | `name`                 | String | The onchain contract name. Use `MyMultiToken`.                                      |
    | `defaultAdmin`         | String | The address with administrator permissions. Use your Dev-Controlled Wallet address. |
    | `primarySaleRecipient` | String | The address for first-time sale proceeds. Use your Dev-Controlled Wallet address.   |
    | `royaltyRecipient`     | String | The address for secondary sale royalties. Use your Dev-Controlled Wallet address.   |
    | `royaltyPercent`       | Float  | The royalty share as a decimal (for example, `0.01` for 1%). Use `0.01`.            |

    **Optional Parameters:**

    | Parameter              | Type       | Description                                                                                                |
    | :--------------------- | :--------- | :--------------------------------------------------------------------------------------------------------- |
    | `symbol`               | String     | The token symbol (for example, `MMTK`).                                                                    |
    | `platformFeeRecipient` | String     | The address that receives platform fees from sales. Set this when implementing platform fee revenue share. |
    | `platformFeePercent`   | Float      | The platform fee percentage as decimal (for example, `0.1` for 10%). Requires `platformFeeRecipient`.      |
    | `contractUri`          | String     | The URL for the contract metadata.                                                                         |
    | `trustedForwarders`    | Strings\[] | A list of addresses that can forward ERC2771 meta-transactions to this contract.                           |

    ### Step 4: Deploy the smart contract

    Deploy by making a request to
    [`POST /templates/{id}/deploy`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/deploy-contract-template):

    <CodeGroup>
      ```ts deploy-erc1155.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const response = await circleContractSdk.deployContractTemplate({
        id: "aea21da6-0aa2-4971-9a1a-5098842b1248",
        blockchain: "ARC-TESTNET",
        name: "MyMultiTokenContract",
        walletId: process.env.WALLET_ID,
        templateParameters: {
          name: "MyMultiToken",
          symbol: "MMTK",
          defaultAdmin: process.env.WALLET_ADDRESS,
          primarySaleRecipient: process.env.WALLET_ADDRESS,
          royaltyRecipient: process.env.WALLET_ADDRESS,
          royaltyPercent: 0.01,
        },
        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM",
          },
        },
      });

      console.log(JSON.stringify(response.data, null, 2));
      ```

      ```python deploy_erc1155.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      import os
      import json

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.TemplatesApi(scpClient)

      request = smart_contract_platform.TemplateContractDeploymentRequest.from_dict({
          "blockchain": "ARC-TESTNET",
          "name": "MyMultiTokenContract",
          "walletId": os.getenv("WALLET_ID"),
          "templateParameters": {
              "name": "MyMultiToken",
              "symbol": "MMTK",
              "defaultAdmin": os.getenv("WALLET_ADDRESS"),
              "primarySaleRecipient": os.getenv("WALLET_ADDRESS"),
              "royaltyRecipient": os.getenv("WALLET_ADDRESS"),
              "royaltyPercent": "0.01",
          },
          "feeLevel": "MEDIUM"
      })

      request.template_parameters["royaltyPercent"] = 0.01

      response = api_instance.deploy_contract_template("aea21da6-0aa2-4971-9a1a-5098842b1248", request)

      print(json.dumps(response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url https://api.circle.com/v1/w3s/templates/aea21da6-0aa2-4971-9a1a-5098842b1248/deploy \
        --header 'Authorization: Bearer <API_KEY>' \
        --header 'Content-Type: application/json' \
        --data '
      {
        "idempotencyKey": "<string>",
        "entitySecretCiphertext": "<string>",
        "blockchain": "ARC-TESTNET",
        "walletId": "<WALLET_ID>",
        "name": "MyMultiTokenContract",
        "templateParameters": {
          "name": "MyMultiToken",
          "symbol": "MMTK",
          "defaultAdmin": "<WALLET_ADDRESS>",
          "primarySaleRecipient": "<WALLET_ADDRESS>",
          "royaltyRecipient": "<WALLET_ADDRESS>",
          "royaltyPercent": 0.01
        },
        "feeLevel": "MEDIUM"
      }
      '
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run deploy-erc1155
      ```

      ```shell Python theme={null}
      python deploy_erc1155.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contractIds": ["019c053d-1ed1-772b-91a8-6970003dad8d"],
      "transactionId": "5b6185b2-f9a1-5645-9db2-ca5d9a330794"
    }
    ```

    <Note>
      A successful response indicates deployment has been **initiated**, not
      completed. Use the `transactionId` to check the deployment status in the next
      step.
    </Note>

    #### 4.1. Check deployment status

    Verify deployment with
    [`GET /transactions/{id}`](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/get-transaction).

    After running the deployment script, copy the `transactionId` from the response
    and update your `.env` file with `TRANSACTION_ID={your-transaction-id}`. Then
    run the check-transaction script to verify deployment status.

    <CodeGroup>
      ```ts check-transaction.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const transactionResponse = await circleDeveloperSdk.getTransaction({
        id: process.env.TRANSACTION_ID!,
      });

      console.log(JSON.stringify(transactionResponse.data, null, 2));
      ```

      ```python check_transaction.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)
      transaction_response = api_instance.get_transaction(
          id=os.getenv("TRANSACTION_ID")
      )

      print(json.dumps(transaction_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run check-transaction
      ```

      ```shell Python theme={null}
      python check_transaction.py
      ```
    </CodeGroup>

    <Note>
      Transaction status may show PENDING immediately after deployment. Wait 10-30
      seconds and re-run check-transaction to see COMPLETE status.
    </Note>

    **Response:**

    ```json theme={null}
    {
      "transaction": {
        "id": "601a0815-f749-41d8-b193-22cadd2a8977",
        "blockchain": "ARC-TESTNET",
        "walletId": "45692c3e-2ffa-5c5b-a99c-61366939114c",
        "sourceAddress": "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
        "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
        "transactionType": "OUTBOUND",
        "custodyType": "DEVELOPER",
        "state": "COMPLETE",
        "amounts": [],
        "nfts": null,
        "txHash": "0x3bfbab5d5ce0d1a5d682cbc742d3940cf59db0369d173b71ba2a3b8f43bfbcb1",
        "blockHash": "0x7d12148f9331556b31f84f58a41b7ff16eaaa47940f9e86733037d7ab74d858e",
        "blockHeight": 23686153,
        "userOpHash": "0x66befac1a371fcdddf1566215e4677127e111dff9253f306f7096fed8642a208",
        "networkFee": "0.044628774800664",
        "firstConfirmDate": "2026-01-26T08:59:56Z",
        "operation": "CONTRACT_EXECUTION",
        "feeLevel": "MEDIUM",
        "estimatedFee": {
          "gasLimit": "500797",
          "networkFee": "0.16506442157883425",
          "baseFee": "160",
          "priorityFee": "9.60345525",
          "maxFee": "329.60345525"
        },
        "refId": "",
        "abiFunctionSignature": "mintTo(address,uint256)",
        "abiParameters": [
          "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
          "1000000000000000000"
        ],
        "createDate": "2026-01-26T08:59:54Z",
        "updateDate": "2026-01-26T08:59:56Z"
      }
    }
    ```

    #### 4.2. Get the contract address

    After deployment completes, retrieve the contract address using
    [`GET /contracts/{id}`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/get-contract).

    After deployment completes, copy the `contractIds[0]` from the deployment
    response and update your `.env` file with `CONTRACT_ID={your-contract-id}`. Then
    run the get-contract script to retrieve the contract address.

    <CodeGroup>
      ```ts get-contract.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const contractResponse = await circleContractSdk.getContract({
        id: process.env.CONTRACT_ID!,
      });

      console.log(JSON.stringify(contractResponse.data, null, 2));
      ```

      ```python get_contract.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.ViewUpdateApi(scpClient)
      contract_response = api_instance.get_contract(
          id=os.getenv("CONTRACT_ID")
      )

      print(json.dumps(contract_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run get-contract
      ```

      ```shell Python theme={null}
      python get_contract.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contract": {
        "id": "b7c35372-ce69-4ccd-bfaa-504c14634f0d",
        "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "blockchain": "ARC-TESTNET",
        "status": "COMPLETE"
      }
    }
    ```

    ***
  </Tab>

  <Tab title="Airdrop">
    ## Deploy an airdrop contract

    The Airdrop template enables mass token distribution to many recipients. Use
    this template for treasury distributions, stakeholder settlements, operational
    payments, or programmatic capital allocation.

    ### Step 3: Prepare for deployment

    #### 3.1. Get your wallet information

    Retrieve your wallet ID from Step 2. Ensure:

    * Wallet custody type is **Dev-Controlled**
    * Blockchain is **Arc Testnet**
    * Account type is **SCA** (Smart Contract Account, recommended for Gas Station
      compatibility)

    Note your wallet's address for subsequent steps.

    #### 3.2. Understand deployment parameters

    | Parameter                | Description                                                                                                                                                       |
    | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `idempotencyKey`         | A unique value to prevent duplicate requests.                                                                                                                     |
    | `name`                   | The offchain contract name (visible in Circle Console only). Use `MyAirdropContract`.                                                                             |
    | `walletId`               | The ID of the wallet deploying the contract. Use your dev-controlled wallet ID.                                                                                   |
    | `templateId`             | The template identifier. Use `13e322f2-18dc-4f57-8eed-4bddfc50f85e` for Airdrop. See [Templates](https://developers.circle.com/contracts/scp-templates-overview). |
    | `blockchain`             | The network to deploy onto. Use `ARC-TESTNET`.                                                                                                                    |
    | `entitySecretCiphertext` | The re-encrypted entity secret. See [Entity Secret Management](https://developers.circle.com/wallets/dev-controlled/entity-secret-management).                    |
    | `feeLevel`               | The fee level for transaction processing. Use `MEDIUM`.                                                                                                           |
    | `templateParameters`     | The onchain initialization parameters (see below).                                                                                                                |

    #### 3.3. Template parameters

    **Required Parameters:**

    | Parameter      | Type   | Description                                                                         |
    | :------------- | :----- | :---------------------------------------------------------------------------------- |
    | `defaultAdmin` | String | The address with administrator permissions. Use your Dev-Controlled Wallet address. |

    **Optional Parameters:**

    | Parameter     | Type   | Description                        |
    | :------------ | :----- | :--------------------------------- |
    | `contractURI` | String | The URL for the contract metadata. |

    ### Step 4: Deploy the smart contract

    Deploy by making a request to
    [`POST /templates/{id}/deploy`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/deploy-contract-template):

    <CodeGroup>
      ```ts deploy-airdrop.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const response = await circleContractSdk.deployContractTemplate({
        id: "13e322f2-18dc-4f57-8eed-4bddfc50f85e",
        blockchain: "ARC-TESTNET",
        name: "MyAirdropContract",
        walletId: process.env.WALLET_ID,
        templateParameters: {
          defaultAdmin: process.env.WALLET_ADDRESS,
        },
        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM",
          },
        },
      });

      console.log(JSON.stringify(response.data, null, 2));
      ```

      ```python deploy_airdrop.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      import os
      import json

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.TemplatesApi(scpClient)

      request = smart_contract_platform.TemplateContractDeploymentRequest.from_dict({
          "blockchain": "ARC-TESTNET",
          "name": "MyAirdropContract",
          "walletId": os.getenv("WALLET_ID"),
          "templateParameters": {
              "defaultAdmin": os.getenv("WALLET_ADDRESS"),
          },
          "feeLevel": "MEDIUM"
      })

      response = api_instance.deploy_contract_template("13e322f2-18dc-4f57-8eed-4bddfc50f85e", request)

      print(json.dumps(response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url https://api.circle.com/v1/w3s/templates/13e322f2-18dc-4f57-8eed-4bddfc50f85e/deploy \
        --header 'Authorization: Bearer <API_KEY>' \
        --header 'Content-Type: application/json' \
        --data '
      {
        "idempotencyKey": "<string>",
        "entitySecretCiphertext": "<string>",
        "blockchain": "ARC-TESTNET",
        "walletId": "<WALLET_ID>",
        "name": "MyAirdropContract",
        "templateParameters": {
          "defaultAdmin": "<WALLET_ADDRESS>"
        },
        "feeLevel": "MEDIUM"
      }
      '
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run deploy-airdrop
      ```

      ```shell Python theme={null}
      python deploy_airdrop.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contractIds": ["019c053d-1ed1-772b-91a8-6970003dad8d"],
      "transactionId": "5b6185b2-f9a1-5645-9db2-ca5d9a330794"
    }
    ```

    <Note>
      A successful response indicates deployment has been **initiated**, not
      completed. Use the `transactionId` to check the deployment status in the next
      step.
    </Note>

    #### 4.1. Check deployment status

    Verify deployment with
    [`GET /transactions/{id}`](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/get-transaction).

    After running the deployment script, copy the `transactionId` from the response
    and update your `.env` file with `TRANSACTION_ID={your-transaction-id}`. Then
    run the check-transaction script to verify deployment status.

    <CodeGroup>
      ```ts check-transaction.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const transactionResponse = await circleDeveloperSdk.getTransaction({
        id: process.env.TRANSACTION_ID!,
      });

      console.log(JSON.stringify(transactionResponse.data, null, 2));
      ```

      ```python check_transaction.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)
      transaction_response = api_instance.get_transaction(
          id=os.getenv("TRANSACTION_ID")
      )

      print(json.dumps(transaction_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run check-transaction
      ```

      ```shell Python theme={null}
      python check_transaction.py
      ```
    </CodeGroup>

    <Note>
      Transaction status may show PENDING immediately after deployment. Wait 10-30
      seconds and re-run check-transaction to see COMPLETE status.
    </Note>

    **Response:**

    ```json theme={null}
    {
      "transaction": {
        "id": "601a0815-f749-41d8-b193-22cadd2a8977",
        "blockchain": "ARC-TESTNET",
        "walletId": "45692c3e-2ffa-5c5b-a99c-61366939114c",
        "sourceAddress": "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
        "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
        "transactionType": "OUTBOUND",
        "custodyType": "DEVELOPER",
        "state": "COMPLETE",
        "amounts": [],
        "nfts": null,
        "txHash": "0x3bfbab5d5ce0d1a5d682cbc742d3940cf59db0369d173b71ba2a3b8f43bfbcb1",
        "blockHash": "0x7d12148f9331556b31f84f58a41b7ff16eaaa47940f9e86733037d7ab74d858e",
        "blockHeight": 23686153,
        "userOpHash": "0x66befac1a371fcdddf1566215e4677127e111dff9253f306f7096fed8642a208",
        "networkFee": "0.044628774800664",
        "firstConfirmDate": "2026-01-26T08:59:56Z",
        "operation": "CONTRACT_EXECUTION",
        "feeLevel": "MEDIUM",
        "estimatedFee": {
          "gasLimit": "500797",
          "networkFee": "0.16506442157883425",
          "baseFee": "160",
          "priorityFee": "9.60345525",
          "maxFee": "329.60345525"
        },
        "refId": "",
        "abiFunctionSignature": "mintTo(address,uint256)",
        "abiParameters": [
          "0xbcf83d3b112cbf43b19904e376dd8dee01fe2758",
          "1000000000000000000"
        ],
        "createDate": "2026-01-26T08:59:54Z",
        "updateDate": "2026-01-26T08:59:56Z"
      }
    }
    ```

    #### 4.2. Get the contract address

    After deployment completes, retrieve the contract address using
    [`GET /contracts/{id}`](https://developers.circle.com/api-reference/contracts/smart-contract-platform/get-contract).

    After deployment completes, copy the `contractIds[0]` from the deployment
    response and update your `.env` file with `CONTRACT_ID={your-contract-id}`. Then
    run the get-contract script to retrieve the contract address.

    <CodeGroup>
      ```ts get-contract.ts theme={null}
      import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

      const circleContractSdk = initiateSmartContractPlatformClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const contractResponse = await circleContractSdk.getContract({
        id: process.env.CONTRACT_ID!,
      });

      console.log(JSON.stringify(contractResponse.data, null, 2));
      ```

      ```python get_contract.py theme={null}
      from circle.web3 import utils, smart_contract_platform
      from pathlib import Path
      from dotenv import load_dotenv
      import os
      import json

      # Load environment variables
      env_path = Path(__file__).resolve().parent / ".env"
      load_dotenv(env_path)

      scpClient = utils.init_smart_contract_platform_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = smart_contract_platform.ViewUpdateApi(scpClient)
      contract_response = api_instance.get_contract(
          id=os.getenv("CONTRACT_ID")
      )

      print(json.dumps(contract_response.data.to_dict(), indent=2, default=str))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run get-contract
      ```

      ```shell Python theme={null}
      python get_contract.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "contract": {
        "id": "b7c35372-ce69-4ccd-bfaa-504c14634f0d",
        "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "blockchain": "ARC-TESTNET",
        "status": "COMPLETE"
      }
    }
    ```

    ***
  </Tab>
</Tabs>

***

## Summary

After completing this tutorial, you've successfully:

* Created a dev-controlled wallet on Arc Testnet
* Funded your wallet with testnet USDC
* Deployed a smart contract using Contract Templates
* Retrieved your contract address


Interact with contracts

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arc.network/llms.txt
> Use this file to discover all available pages before exploring further.

# Interact with contracts

> Execute contract functions on Arc Testnet to mint tokens, transfer assets, and perform contract operations.

This tutorial guides you through interacting with smart contracts deployed on
Arc Testnet. You'll learn how to execute contract functions like minting tokens,
transferring assets, and performing contract-specific operations for ERC-20,
ERC-721, ERC-1155, and Airdrop contracts.

## Prerequisites

Complete the [Deploy contracts](/arc/tutorials/deploy-contracts) tutorial first.
You'll need a deployed contract.

## Step 1. Update your project

In this step, you update the project you created in the Deploy contracts
tutorial with the additional environment variable and npm scripts needed for
contract interactions.

### 1.1. Set environment variables

Add this new variable to your existing `.env` file (from the Deploy contracts
tutorial):

```text .env theme={null}
RECIPIENT_WALLET_ADDRESS=YOUR_RECIPIENT_ADDRESS
```

* `RECIPIENT_WALLET_ADDRESS` is the wallet address that receives transferred
  tokens during the interaction examples.

<Note>
  Your `.env` file should already have `CIRCLE_API_KEY`, `CIRCLE_ENTITY_SECRET`,
  `WALLET_ID`, `WALLET_ADDRESS`, and `CONTRACT_ADDRESS` from the Deploy
  contracts tutorial. You're only adding 1 new variable here.
</Note>

The npm run commands in this tutorial load variables from `.env` using Node.js
native env-file support.

<Tip>
  Prefer editing `.env` files in your IDE or editor so credentials are not
  leaked to your shell history.
</Tip>

### 1.2. Add npm scripts

Add run scripts for contract interactions to your `package.json`:

```shell theme={null}
npm pkg set scripts.interact-erc20="tsx --env-file=.env interact-erc20.ts"
npm pkg set scripts.interact-erc721="tsx --env-file=.env interact-erc721.ts"
npm pkg set scripts.interact-erc1155="tsx --env-file=.env interact-erc1155.ts"
npm pkg set scripts.interact-airdrop="tsx --env-file=.env interact-airdrop.ts"
```

## Step 2. Interact with contracts

Select the contract type you want to interact with from the tabs below.

<Tabs>
  <Tab title="ERC-20">
    ## Interact with ERC-20 contracts

    ERC-20 tokens support standard fungible token operations. You'll learn to mint
    new tokens and transfer them between addresses.

    ### Mint tokens

    Use the `mintTo` function to mint tokens. The wallet must have `MINTER_ROLE`.

    <CodeGroup>
      ```ts Node.js theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const mintResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "mintTo(address,uint256)",
          abiParameters: [
            process.env.WALLET_ADDRESS,
            "1000000000000000000", // 1 token with 18 decimals
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(mintResponse.data, null, 2));
      ```

      ```python Python theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,uint256)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "1000000000000000000"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)

      print(json.dumps(mint_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "mintTo(address,uint256)",
          "abiParameters": [
            "<WALLET_ADDRESS>",
            "1000000000000000000"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    <Note>
      **Token decimals**: ERC-20 tokens typically use 18 decimals. To mint 1 token,
      use `1000000000000000000` (1 × 10^18).
    </Note>

    ### Transfer tokens

    Use the `transfer` function to send tokens to another address.

    <CodeGroup>
      ```ts Node.js theme={null}
      const transferResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "transfer(address,uint256)",
          abiParameters: [
            process.env.RECIPIENT_WALLET_ADDRESS,
            "1000000000000000000", // 1 token with 18 decimals
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(transferResponse.data, null, 2));
      ```

      ```python Python theme={null}
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "transfer(address,uint256)",
          "abiParameters": [
              os.getenv("RECIPIENT_WALLET_ADDRESS"),
              "1000000000000000000"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)

      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "transfer(address,uint256)",
          "abiParameters": [
            "<RECIPIENT_ADDRESS>",
            "1000000000000000000"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    ### Full ERC-20 interaction script

    Here's the full script combining mint and transfer operations:

    <CodeGroup>
      ```ts interact-erc20.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      async function main() {
        // Mint tokens
        const mintResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "mintTo(address,uint256)",
            abiParameters: [
              process.env.WALLET_ADDRESS,
              "1000000000000000000", // 1 token with 18 decimals
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(mintResponse.data, null, 2));

        // Transfer tokens
        const transferResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "transfer(address,uint256)",
            abiParameters: [
              process.env.RECIPIENT_WALLET_ADDRESS,
              "1000000000000000000", // 1 token with 18 decimals
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(transferResponse.data, null, 2));
      }

      main();
      ```

      ```python interact_erc20.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      # Mint tokens
      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,uint256)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "1000000000000000000"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)
      print(json.dumps(mint_response.data.to_dict(), indent=2))

      # Transfer tokens
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "transfer(address,uint256)",
          "abiParameters": [
              os.getenv("RECIPIENT_WALLET_ADDRESS"),
              "1000000000000000000"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)
      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run interact-erc20
      ```

      ```shell Python theme={null}
      python interact_erc20.py
      ```
    </CodeGroup>
  </Tab>

  <Tab title="ERC-721">
    ## Interact with ERC-721 contracts

    ERC-721 tokens are unique tokens. Each token has a unique ID and can have
    associated metadata stored on IPFS or other storage.

    ### Mint tokens

    Use the `mintTo` function to mint tokens. The wallet must have `MINTER_ROLE`.

    <CodeGroup>
      ```ts Node.js theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const mintResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "mintTo(address,string)",
          abiParameters: [
            process.env.WALLET_ADDRESS,
            "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(mintResponse.data, null, 2));
      ```

      ```python Python theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,string)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)

      print(json.dumps(mint_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "mintTo(address,string)",
          "abiParameters": [
            "<WALLET_ADDRESS>",
            "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    <Note>
      **Metadata URI**: The second parameter is the token metadata URI. It typically
      points to an IPFS hash containing the token's metadata (name, description,
      image, etc.). You can use the example IPFS URI from the code sample for
      testing.
    </Note>

    ### Transfer tokens

    Use the `transferFrom` or `safeTransferFrom` function to transfer tokens between
    addresses.

    <CodeGroup>
      ```ts Node.js theme={null}
      const transferResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "safeTransferFrom(address,address,uint256)",
          abiParameters: [
            "<FROM_ADDRESS>",
            "<TO_ADDRESS>",
            "1", // Token ID
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(transferResponse.data, null, 2));
      ```

      ```python Python theme={null}
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "safeTransferFrom(address,address,uint256)",
          "abiParameters": [
              "<FROM_ADDRESS>",
              "<TO_ADDRESS>",
              "1"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)

      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "safeTransferFrom(address,address,uint256)",
          "abiParameters": [
            "<FROM_ADDRESS>",
            "<TO_ADDRESS>",
            "1"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    ### Full ERC-721 interaction script

    Here's the full script combining mint and transfer operations:

    <CodeGroup>
      ```ts interact-erc721.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      async function main() {
        // Mint token
        const mintResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "mintTo(address,string)",
            abiParameters: [
              process.env.WALLET_ADDRESS,
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(mintResponse.data, null, 2));

        // Transfer token (token ID 1)
        const transferResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "safeTransferFrom(address,address,uint256)",
            abiParameters: [
              process.env.WALLET_ADDRESS,
              process.env.RECIPIENT_WALLET_ADDRESS,
              "1", // Token ID
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(transferResponse.data, null, 2));
      }

      main();
      ```

      ```python interact_erc721.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      # Mint token
      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,string)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)
      print(json.dumps(mint_response.data.to_dict(), indent=2))

      # Transfer token (token ID 1)
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "safeTransferFrom(address,address,uint256)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              os.getenv("RECIPIENT_WALLET_ADDRESS"),
              "1"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)
      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run interact-erc721
      ```

      ```shell Python theme={null}
      python interact_erc721.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```
  </Tab>

  <Tab title="ERC-1155">
    ## Interact with ERC-1155 contracts

    ERC-1155 contracts support multiple token types in a single contract. Each token
    has a unique ID and can be fungible or non-fungible.

    ### Mint tokens

    Use the `mintTo` function to mint tokens. The wallet must have `MINTER_ROLE`.
    The first mint requires the maximum uint256 value to create token ID 0. For
    subsequent mints, always use `0` which creates the next token ID.

    <CodeGroup>
      ```ts Node.js theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const mintResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "mintTo(address,uint256,string,uint256)",
          abiParameters: [
            process.env.WALLET_ADDRESS,
            "115792089237316195423570985008687907853269984665640564039457584007913129639935", // Max uint256 = ID 0
            "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
            "1", // Amount
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(mintResponse.data, null, 2));
      ```

      ```python Python theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,uint256,string,uint256)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "115792089237316195423570985008687907853269984665640564039457584007913129639935",
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
              "1"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)

      print(json.dumps(mint_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "mintTo(address,uint256,string,uint256)",
          "abiParameters": [
            "<WALLET_ADDRESS>",
            "115792089237316195423570985008687907853269984665640564039457584007913129639935",
            "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
            "1"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    <Note>
      **ERC-1155 Token ID Creation**: The first mint of each token ID requires
      passing the maximum uint256 value (`2^256 - 1` or
      `115792089237316195423570985008687907853269984665640564039457584007913129639935`)
      to create token ID 0 in the contract. For all subsequent mints, use `0` which
      creates the next sequential token ID (1, 2, 3, etc.). This is an ERC-1155
      standard requirement for lazy minting, where token IDs are created on demand
      rather than pre-initialized.
    </Note>

    ### Batch transfer tokens

    Use the `safeBatchTransferFrom` function to transfer multiple token types in a
    single transaction.

    <CodeGroup>
      ```ts Node.js theme={null}
      const transferResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature:
            "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
          abiParameters: [
            "<FROM_ADDRESS>",
            "<TO_ADDRESS>",
            ["0"], // Token IDs
            ["1"], // Amounts
            "0x", // Empty bytes
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(transferResponse.data, null, 2));
      ```

      ```python Python theme={null}
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
          "abiParameters": [
              "<FROM_ADDRESS>",
              "<TO_ADDRESS>",
              ["0"],
              ["1"],
              "0x"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)

      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
          "abiParameters": [
            "<FROM_ADDRESS>",
            "<TO_ADDRESS>",
            ["0"],
            ["1"],
            "0x"
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    ### Full ERC-1155 interaction script

    Here's the full script combining mint and batch transfer operations:

    <CodeGroup>
      ```ts interact-erc1155.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      async function main() {
        // Mint tokens (token ID 0)
        const mintResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "mintTo(address,uint256,string,uint256)",
            abiParameters: [
              process.env.WALLET_ADDRESS,
              "115792089237316195423570985008687907853269984665640564039457584007913129639935", // Max uint256 = ID 0
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
              "1", // Amount
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(mintResponse.data, null, 2));

        // Batch transfer tokens
        const transferResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature:
              "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
            abiParameters: [
              process.env.WALLET_ADDRESS,
              process.env.RECIPIENT_WALLET_ADDRESS,
              ["0"], // Token IDs
              ["1"], // Amounts
              "0x", // Empty bytes
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(transferResponse.data, null, 2));
      }

      main();
      ```

      ```python interact_erc1155.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      # Mint tokens (token ID 0)
      mint_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "mintTo(address,uint256,string,uint256)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              "115792089237316195423570985008687907853269984665640564039457584007913129639935",
              "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei",
              "1"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      mint_response = api_instance.create_developer_transaction_contract_execution(mint_request)
      print(json.dumps(mint_response.data.to_dict(), indent=2))

      # Batch transfer tokens
      transfer_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
          "abiParameters": [
              os.getenv("WALLET_ADDRESS"),
              os.getenv("RECIPIENT_WALLET_ADDRESS"),
              ["0"],
              ["1"],
              "0x"
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      transfer_response = api_instance.create_developer_transaction_contract_execution(transfer_request)
      print(json.dumps(transfer_response.data.to_dict(), indent=2))
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run interact-erc1155
      ```

      ```shell Python theme={null}
      python interact_erc1155.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```
  </Tab>

  <Tab title="Airdrop">
    ## Execute airdrop operations

    The Airdrop contract enables mass token distribution to multiple recipients.

    ### Prerequisites

    Before executing an airdrop, you need:

    1. **A token contract address** - Deploy one using the
       [ERC-20](/arc/tutorials/deploy-contracts#erc-20),
       [ERC-721](/arc/tutorials/deploy-contracts#erc-721), or
       [ERC-1155](/arc/tutorials/deploy-contracts#erc-1155) templates, or use an
       existing token
    2. **Token balance** - Your wallet must hold enough tokens to distribute
    3. **Token approval** - Call the `approve` or `setApprovalForAll` function on
       your token contract to allow the airdrop contract to transfer tokens

    ### Execute an ERC-20 airdrop

    Use the `airdropERC20` function to distribute ERC-20 tokens to multiple
    recipients.

    <CodeGroup>
      ```ts Node.js theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      const airdropResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "airdropERC20(address,(address,uint256)[])",
          abiParameters: [
            "<TOKEN_CONTRACT_ADDRESS>", // ERC-20 token contract address
            [
              ["<RECIPIENT_ADDRESS_1>", "1000000000000000000"],
              ["<RECIPIENT_ADDRESS_2>", "2000000000000000000"],
            ],
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(airdropResponse.data, null, 2));
      ```

      ```python Python theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      airdrop_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "airdropERC20(address,(address,uint256)[])",
          "abiParameters": [
              "<TOKEN_CONTRACT_ADDRESS>",
              [
                  ["<RECIPIENT_ADDRESS_1>", "1000000000000000000"],
                  ["<RECIPIENT_ADDRESS_2>", "2000000000000000000"]
              ]
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      airdrop_response = api_instance.create_developer_transaction_contract_execution(airdrop_request)

      print(json.dumps(airdrop_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "airdropERC20(address,(address,uint256)[])",
          "abiParameters": [
            "<TOKEN_CONTRACT_ADDRESS>",
            [
              ["<RECIPIENT_ADDRESS_1>", "1000000000000000000"],
              ["<RECIPIENT_ADDRESS_2>", "2000000000000000000"]
            ]
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    <Note>
      **Token contract**: The first parameter is the address of the ERC-20 token
      contract you want to airdrop. You must deploy this contract first using the
      [Deploy contracts](/arc/tutorials/deploy-contracts) tutorial.
    </Note>

    ### Execute an ERC-721 airdrop

    Use the `airdropERC721` function to distribute tokens to multiple recipients.

    <CodeGroup>
      ```ts Node.js theme={null}
      const airdropResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "airdropERC721(address,(address,uint256)[])",
          abiParameters: [
            "<TOKEN_CONTRACT_ADDRESS>", // ERC-721 token contract address
            [
              ["<RECIPIENT_ADDRESS_1>", "1"], // Token ID 1
              ["<RECIPIENT_ADDRESS_2>", "2"], // Token ID 2
            ],
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(airdropResponse.data, null, 2));
      ```

      ```python Python theme={null}
      airdrop_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "airdropERC721(address,(address,uint256)[])",
          "abiParameters": [
              "<TOKEN_CONTRACT_ADDRESS>",
              [
                  ["<RECIPIENT_ADDRESS_1>", "1"],
                  ["<RECIPIENT_ADDRESS_2>", "2"]
              ]
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      airdrop_response = api_instance.create_developer_transaction_contract_execution(airdrop_request)

      print(json.dumps(airdrop_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "airdropERC721(address,(address,uint256)[])",
          "abiParameters": [
            "<TOKEN_CONTRACT_ADDRESS>",
            [
              ["<RECIPIENT_ADDRESS_1>", "1"],
              ["<RECIPIENT_ADDRESS_2>", "2"]
            ]
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```

    ### Execute an ERC-1155 airdrop

    Use the `airdropERC1155` function to distribute ERC-1155 tokens to multiple
    recipients.

    <CodeGroup>
      ```ts Node.js theme={null}
      const airdropResponse =
        await circleDeveloperSdk.createContractExecutionTransaction({
          walletId: process.env.WALLET_ID,
          abiFunctionSignature: "airdropERC1155(address,(address,uint256,uint256)[])",
          abiParameters: [
            "<TOKEN_CONTRACT_ADDRESS>", // ERC-1155 token contract address
            [
              ["<RECIPIENT_ADDRESS_1>", "0", "10"], // Token ID 0, amount 10
              ["<RECIPIENT_ADDRESS_2>", "1", "5"], // Token ID 1, amount 5
            ],
          ],
          contractAddress: process.env.CONTRACT_ADDRESS,
          fee: {
            type: "level",
            config: {
              feeLevel: "MEDIUM",
            },
          },
        });

      console.log(JSON.stringify(airdropResponse.data, null, 2));
      ```

      ```python Python theme={null}
      airdrop_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "airdropERC1155(address,(address,uint256,uint256)[])",
          "abiParameters": [
              "<TOKEN_CONTRACT_ADDRESS>",
              [
                  ["<RECIPIENT_ADDRESS_1>", "0", "10"],
                  ["<RECIPIENT_ADDRESS_2>", "1", "5"]
              ]
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      airdrop_response = api_instance.create_developer_transaction_contract_execution(airdrop_request)

      print(json.dumps(airdrop_response.data.to_dict(), indent=2))
      ```

      ```shell cURL theme={null}
      curl --request POST \
        --url 'https://api.circle.com/v1/w3s/developer/transactions/contractExecution' \
        --header 'authorization: Bearer <API_KEY>' \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '{
          "idempotencyKey": "<string>",
          "entitySecretCiphertext": "<string>",
          "walletId": "<WALLET_ID>",
          "abiFunctionSignature": "airdropERC1155(address,(address,uint256,uint256)[])",
          "abiParameters": [
            "<TOKEN_CONTRACT_ADDRESS>",
            [
              ["<RECIPIENT_ADDRESS_1>", "0", "10"],
              ["<RECIPIENT_ADDRESS_2>", "1", "5"]
            ]
          ],
          "contractAddress": "<CONTRACT_ADDRESS>",
          "feeLevel": "MEDIUM"
        }'
      ```
    </CodeGroup>

    ### Full airdrop interaction script

    Here's the full script for executing an ERC-20 airdrop. You can adapt it for
    ERC-721 or ERC-1155 by changing the function signature and parameters as shown
    in the examples previously:

    <CodeGroup>
      ```ts interact-airdrop.ts theme={null}
      import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

      const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });

      async function main() {
        // Execute ERC-20 airdrop
        const airdropResponse =
          await circleDeveloperSdk.createContractExecutionTransaction({
            walletId: process.env.WALLET_ID,
            abiFunctionSignature: "airdropERC20(address,(address,uint256)[])",
            abiParameters: [
              process.env.TOKEN_CONTRACT_ADDRESS, // ERC-20 token contract address
              [
                [process.env.RECIPIENT_ADDRESS_1, "1000000000000000000"],
                [process.env.RECIPIENT_ADDRESS_2, "2000000000000000000"],
              ],
            ],
            contractAddress: process.env.CONTRACT_ADDRESS,
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

        console.log(JSON.stringify(airdropResponse.data, null, 2));

        // For ERC-721 airdrop, use:
        // abiFunctionSignature: "airdropERC721(address,(address,uint256)[])"
        // abiParameters: [tokenAddress, [[recipient1, tokenId1], [recipient2, tokenId2]]]

        // For ERC-1155 airdrop, use:
        // abiFunctionSignature: "airdropERC1155(address,(address,uint256,uint256)[])"
        // abiParameters: [tokenAddress, [[recipient1, tokenId, amount], [recipient2, tokenId, amount]]]
      }

      main();
      ```

      ```python interact_airdrop.py theme={null}
      from circle.web3 import utils, developer_controlled_wallets
      import os
      import json

      client = utils.init_developer_controlled_wallets_client(
          api_key=os.getenv("CIRCLE_API_KEY"),
          entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
      )

      api_instance = developer_controlled_wallets.TransactionsApi(client)

      # Execute ERC-20 airdrop
      airdrop_request = developer_controlled_wallets.CreateContractExecutionTransactionForDeveloperRequest.from_dict({
          "walletId": os.getenv("WALLET_ID"),
          "abiFunctionSignature": "airdropERC20(address,(address,uint256)[])",
          "abiParameters": [
              os.getenv("TOKEN_CONTRACT_ADDRESS"),
              [
                  [os.getenv("RECIPIENT_ADDRESS_1"), "1000000000000000000"],
                  [os.getenv("RECIPIENT_ADDRESS_2"), "2000000000000000000"]
              ]
          ],
          "contractAddress": os.getenv("CONTRACT_ADDRESS"),
          "feeLevel": "MEDIUM",
      })

      airdrop_response = api_instance.create_developer_transaction_contract_execution(airdrop_request)
      print(json.dumps(airdrop_response.data.to_dict(), indent=2))

      # For ERC-721 airdrop, use:
      # abiFunctionSignature: "airdropERC721(address,(address,uint256)[])"
      # abiParameters: [token_address, [[recipient1, token_id1], [recipient2, token_id2]]]

      # For ERC-1155 airdrop, use:
      # abiFunctionSignature: "airdropERC1155(address,(address,uint256,uint256)[])"
      # abiParameters: [token_address, [[recipient1, token_id, amount], [recipient2, token_id, amount]]]
      ```
    </CodeGroup>

    **Run the script:**

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run interact-airdrop
      ```

      ```shell Python theme={null}
      python interact_airdrop.py
      ```
    </CodeGroup>

    **Response:**

    ```json theme={null}
    {
      "id": "601a0815-f749-41d8-b193-22cadd2a8977",
      "state": "INITIATED"
    }
    ```
  </Tab>
</Tabs>

***

## Summary

After completing this tutorial, you've learned how to:

* Execute contract functions using the Circle SDKs
* Mint and transfer tokens for your deployed contracts
* Perform contract-specific operations based on token type



> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arc.network/llms.txt
> Use this file to discover all available pages before exploring further.

# Monitor contract events

> Track onchain activity by monitoring contract events.

Track contract events and get event logs with the Circle Contracts API.

## Prerequisites

You need a deployed contract to monitor. If you completed the
[Deploy contracts](/arc/tutorials/deploy-contracts) tutorial, you can continue
with that contract. If your contract was deployed elsewhere, import it in
[Step 3](#step-3-import-a-contract-optional).

## Step 1. Update your project

If you haven't already, add run scripts for monitoring contract events to your
`package.json`:

```shell theme={null}
npm pkg set scripts.webhook="tsx webhook-receiver.ts"
npm pkg set scripts.import-contract="tsx --env-file=.env import-contract.ts"
npm pkg set scripts.create-monitor="tsx --env-file=.env create-monitor.ts"
npm pkg set scripts.get-event-logs="tsx --env-file=.env get-event-logs.ts"
```

<Note>
  If you completed the Deploy contracts tutorial, your project already has the
  required SDKs installed. The npm scripts previously listed work with your
  existing setup.
</Note>

## Step 2. Set up your webhook

Event monitors send real-time updates to your webhook endpoint when events
happen.

<Tabs>
  <Tab title="webhook.site">
    1. Visit [webhook.site](https://webhook.site)
    2. Copy your unique webhook URL (for example, `https://webhook.site/your-uuid`)
  </Tab>

  <Tab title="ngrok">
    1. Install `ngrok` from [ngrok.com](https://ngrok.com)

    2. Create a webhook receiver script:

    <CodeGroup>
      ```ts webhook-receiver.ts theme={null}
      import express, { Request, Response } from "express";

      const app = express();
      app.use(express.json());

      app.post("/webhook", (req: Request, res: Response) => {
        console.log("Received webhook:");
        console.log(JSON.stringify(req.body, null, 2));
        res.status(200).json({ received: true });
      });

      const PORT = 3000;
      app.listen(PORT, () => {
        console.log(`Webhook receiver listening on port ${PORT}`);
        console.log(`Endpoint: http://localhost:${PORT}/webhook`);
      });
      ```

      ```python webhook_receiver.py theme={null}
      from flask import Flask, request, jsonify
      import json

      app = Flask(__name__)

      @app.route("/webhook", methods=["POST"])
      def webhook():
          data = request.get_json()
          print("Received webhook:")
          print(json.dumps(data, indent=2))
          return jsonify({"received": True}), 200

      if __name__ == "__main__":
          PORT = 3000
          print(f"Webhook receiver listening on port {PORT}")
          print(f"Endpoint: http://localhost:{PORT}/webhook")
          app.run(port=PORT)
      ```
    </CodeGroup>

    3. Start the webhook receiver:

    <CodeGroup>
      ```shell Node.js theme={null}
      npm run webhook
      ```

      ```shell Python theme={null}
      python webhook_receiver.py
      ```
    </CodeGroup>

    4. In a separate terminal, start `ngrok`:

    ```shell theme={null}
    ngrok http 3000
    ```

    5. Copy the HTTPS forwarding URL (for example,
       `https://abc123.ngrok-free.app/webhook`)

    <Note>
      If using `ngrok` for local testing, you can optionally set `WEBHOOK_URL` in
      your `.env` file to store your `ngrok` forwarding URL.
    </Note>
  </Tab>
</Tabs>

## Step 3. Register your webhook in Console

Register your webhook URL in the Developer Console:

1. Go to [Developer Console](https://console.circle.com)
2. Navigate to **Webhooks** (left sidebar)
3. Click **Add a webhook**
4. Enter your webhook URL (from Step 1) and create the webhook

<Note>
  Register your webhook before creating event monitors. This allows Circle to
  send notifications to your endpoint.
</Note>

## Step 4. Import a contract (optional)

If your contract was deployed elsewhere and is not yet available in the
Developer Console, import it first. If you deployed a contract using Circle
Contracts, including the [Deploy contracts](/arc/tutorials/deploy-contracts)
tutorial, skip this step. Your contract is already available in the Console.

<CodeGroup>
  ```ts import-contract.ts theme={null}
  import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

  const contractClient = initiateSmartContractPlatformClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  async function importContract() {
    try {
      const response = await contractClient.importContract({
        blockchain: "ARC-TESTNET",
        address: process.env.CONTRACT_ADDRESS,
        name: "MyContract",
      });

      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error importing contract:", error.message);
      throw error;
    }
  }

  importContract();
  ```

  ```python import_contract.py theme={null}
  from circle.web3 import utils, smart_contract_platform
  import os
  import json

  client = utils.init_smart_contract_platform_client(
      api_key=os.getenv("CIRCLE_API_KEY"),
      entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
  )

  def import_contract():
      try:
          contracts_api = smart_contract_platform.ContractsApi(client)
          import_request = smart_contract_platform.ImportContractRequest(
              blockchain="ARC-TESTNET",
              address=os.getenv("CONTRACT_ADDRESS"),
              name="MyContract",
          )

          response = contracts_api.import_contract(import_contract_request=import_request)

          print(json.dumps(response.data.to_dict(), indent=2))

      except Exception as error:
          print(f"Error importing contract: {error}")
          raise error

  import_contract()
  ```
</CodeGroup>

**Run the script:**

<CodeGroup>
  ```shell Node.js theme={null}
  npm run import-contract
  ```

  ```shell Python theme={null}
  python import_contract.py
  ```
</CodeGroup>

<Note>
  If the contract is already imported, you'll see an error: `contract already
      exists`. This means the contract is already available in the Console and you
  can proceed to create an event monitor.
</Note>

## Step 5. Create an event monitor

Event monitors track specific contract events. They send updates to your webhook
endpoint. This example monitors `Transfer` events:

<CodeGroup>
  ```ts create-monitor.ts theme={null}
  import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

  const contractClient = initiateSmartContractPlatformClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  async function createEventMonitor() {
    try {
      const response = await contractClient.createEventMonitor({
        blockchain: "ARC-TESTNET",
        contractAddress: process.env.CONTRACT_ADDRESS,
        eventSignature: "Transfer(address,address,uint256)",
      });

      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error creating event monitor:", error.message);
      throw error;
    }
  }

  createEventMonitor();
  ```

  ```python create_monitor.py theme={null}
  from circle.web3 import utils, smart_contract_platform
  import os
  import json

  client = utils.init_smart_contract_platform_client(
      api_key=os.getenv("CIRCLE_API_KEY"),
      entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
  )

  def create_event_monitor():
      try:
          event_monitors_api = smart_contract_platform.EventMonitorsApi(client)
          monitor_request = smart_contract_platform.CreateEventMonitorRequest(
              blockchain="ARC-TESTNET",
              contract_address=os.getenv("CONTRACT_ADDRESS"),
              event_signature="Transfer(address,address,uint256)",
          )

          response = event_monitors_api.create_event_monitor(
              create_event_monitor_request=monitor_request
          )

          print(json.dumps(response.data.to_dict(), indent=2))
      except Exception as error:
          print(f"Error creating event monitor: {error}")
          raise

  create_event_monitor()
  ```
</CodeGroup>

**Run the script:**

<CodeGroup>
  ```shell Node.js theme={null}
  npm run create-monitor
  ```

  ```shell Python theme={null}
  python create_monitor.py
  ```
</CodeGroup>

**Response:**

```json theme={null}
{
  "eventMonitor": {
    "id": "019bf984-b4da-7026-a3d2-674ce371a933",
    "contractName": "TestERC20Token",
    "contractId": "019bf8be-7be5-7a3e-89cc-05bcd7413f20",
    "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
    "blockchain": "ARC-TESTNET",
    "eventSignature": "Transfer(address,address,uint256)",
    "eventSignatureHash": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "isEnabled": true,
    "createDate": "2026-01-26T08:56:22.490638Z",
    "updateDate": "2026-01-26T08:56:22.490638Z"
  }
}
```

## Step 6. Receive webhook notifications

When events occur, Circle sends updates to your endpoint. Here is what a
`Transfer` event looks like:

```json theme={null}
{
  "subscriptionId": "f0332621-a117-4b7b-bdf0-5c61a4681826",
  "notificationId": "5c5eea9f-398f-426f-a4a5-1bdc28b36d2c",
  "notificationType": "contracts.eventLog",
  "notification": {
    "contractAddress": "0x4abcffb90897fe7ce86ed689d1178076544a021b",
    "blockchain": "ARC-TESTNET",
    "txHash": "0xe15d6dbb50178f60930b8a3e3e775f3c022505ea2e351b6c2c2985d2405c8ebc",
    "userOpHash": "0x78c3e8185ff9abfc7197a8432d9b79566123616c136001e609102c97e732e55e",
    "blockHash": "0x0ad6bf57a110d42620defbcb9af98d6223f060de588ed96ae495ddeaf3565c8d",
    "blockHeight": 22807198,
    "eventSignature": "Transfer(address,address,uint256)",
    "eventSignatureHash": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "topics": [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x000000000000000000000000bcf83d3b112cbf43b19904e376dd8dee01fe2758"
    ],
    "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    "firstConfirmDate": "2026-01-21T06:53:12Z"
  },
  "timestamp": "2026-01-21T06:53:13.194467201Z",
  "version": 2
}
```

**Key fields:**

* `notificationType`: Always `"contracts.eventLog"` for event monitor webhooks
* `notification.eventSignature`: The event that was emitted
* `notification.contractAddress`: Address of the contract that emitted the event
* `notification.blockchain`: The blockchain network (for example, `ARC-TESTNET`)
* `notification.txHash`: Transaction hash where the event occurred
* `notification.userOpHash`: User operation hash (for smart contract accounts)
* `notification.blockHash`: Hash of the block containing the transaction
* `notification.blockHeight`: Block number where the event occurred
* `notification.eventSignatureHash`: Keccak256 hash of the event signature
* `notification.topics`: Indexed event parameters (for example, `from` and `to`
  addresses)
* `notification.data`: Non-indexed event parameters (for example, token amount)
* `notification.firstConfirmDate`: Timestamp when the event was first confirmed
* `timestamp`: Timestamp when the webhook was sent
* `version`: Webhook payload version

<Tip>
  You can verify webhook delivery status in the [Developer
  Console](https://console.circle.com) under Contracts → Monitoring.
</Tip>

## Step 7. Retrieve event logs

You can also query event logs with the API. This is useful for past events or if
you prefer polling.

<Note>
  **Webhooks vs Polling**: Webhooks send real-time updates (push). Polling needs
  periodic API calls (pull). Use webhooks for production and polling for testing
  or past queries.
</Note>

<CodeGroup>
  ```ts get-event-logs.ts theme={null}
  import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";

  const contractClient = initiateSmartContractPlatformClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  async function getEventLogs() {
    try {
      const response = await contractClient.listEventLogs({
        contractAddress: process.env.CONTRACT_ADDRESS,
        blockchain: "ARC-TESTNET",
        pageSize: 10,
      });

      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching event logs:", error.message);
      throw error;
    }
  }

  getEventLogs();
  ```

  ```python get_event_logs.py theme={null}
  from circle.web3 import utils, smart_contract_platform
  import os
  import json

  client = utils.init_smart_contract_platform_client(
      api_key=os.getenv("CIRCLE_API_KEY"),
      entity_secret=os.getenv("CIRCLE_ENTITY_SECRET")
  )

  event_monitors_api = smart_contract_platform.EventMonitorsApi(client)

  def get_event_logs():
      try:
          response = event_monitors_api.list_event_logs(
              contract_address=os.getenv("CONTRACT_ADDRESS"),
              blockchain="ARC-TESTNET",
              page_size=10
          )

          print(json.dumps(response.data.to_dict(), indent=2, default=str))

      except Exception as error:
          print(f"Error fetching event logs: {error}")
          raise

  get_event_logs()
  ```
</CodeGroup>

**Run the script:**

<CodeGroup>
  ```shell Node.js theme={null}
  npm run get-event-logs
  ```

  ```shell Python theme={null}
  python get_event_logs.py
  ```
</CodeGroup>

<Note>
  Replace `CONTRACT_ADDRESS` with your contract address. You can get this
  address when you deploy the contract, or by listing your contracts with
  `listContracts()`.
</Note>

**Response:**

```json theme={null}
{
  "eventLogs": [
    {
      "id": "019bf987-f901-7145-9e95-55f177b05b24",
      "subscriptionId": "019bf984-b4da-7026-a3d2-674ce371a933",
      "contractId": "019bf8be-7be5-7a3e-89cc-05bcd7413f20",
      "contractName": "TestERC20Token",
      "blockchain": "ARC-TESTNET",
      "txHash": "0x3bfbab5d5ce0d1a5d682cbc742d3940cf59db0369d173b71ba2a3b8f43bfbcb1",
      "logIndex": "50",
      "blockHash": "0x7d12148f9331556b31f84f58a41b7ff16eaaa47940f9e86733037d7ab74d858e",
      "blockHeight": 23686153,
      "contractAddress": "0x281156899e5bd6fecf1c0831ee24894eeeaea2f8",
      "eventSignature": "Transfer(address,address,uint256)",
      "eventSignatureHash": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000bcf83d3b112cbf43b19904e376dd8dee01fe2758"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "decodedTopics": null,
      "decodedData": null,
      "userOpHash": "0x66befac1a371fcdddf1566215e4677127e111dff9253f306f7096fed8642a208",
      "firstConfirmDate": "2026-01-26T08:59:55Z",
      "createDate": "2026-01-26T08:59:56.545962Z",
      "updateDate": "2026-01-26T08:59:56.545962Z"
    }
  ]
}
```

<Note>
  You can view, update, and delete event monitors with the Circle Contracts API.
  See the [API
  Reference](https://developers.circle.com/api-reference/contracts/smart-contract-platform/get-event-monitors)
  for details on managing your monitors.
</Note>

## Summary

After completing this tutorial, you've successfully:

* Set up webhook endpoints using webhook.site or `ngrok`
* Registered webhooks in the Developer Console
* Created event monitors for specific contract events
* Received real-time webhook updates for contract events
* Retrieved past event logs with the Circle SDK

