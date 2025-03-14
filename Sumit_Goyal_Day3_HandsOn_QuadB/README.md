# Node.js project for canisters creation and deployment.

## Introduction  

This project is an **npm package** designed to simplify the creation, deployment and management of the identities without setup dfx.  
With this package, users can :  
1. Create a new ICP project
2. Deploy canisters on the mainnet.  
3. Redeem a coupon for any identity using the coupon and principal ID .
4. Check the cycles balance of any identity using the principal ID.
5. Create a new ICP identity.
6. Retrieve the principal of the local identity.
7. Switch to a different local identity using its name.
8. Display the path of the current location.
9. Show help information about the commands.

---  

## Features  

- Easy setup and configuration for canisters creation and deployment.  
- Command-based execution for flexibility.  
- Create an identity, use it, and retrieve the principal ID of identities.
- Redeem coupons on any user identity's principal.

---  

## How to Use icp-test  

### icp-cli Commands  

- `new <projectName>` – Creates a new ICP project.  
- `deploy` – Deploys canisters on the mainnet.  
- `redeem <toPrincipalId> <couponId>` – Redeems a coupon for a specific identity using the given principal ID.  
- `cycles-balance [PrincipalId]` – Checks the cycles balance of an identity using the provided principal ID. (If no principal ID is given, it defaults to the current user's principal.)  
- `new-identity <identityName>` – Creates a new ICP identity.  
- `identity-get-principal` – Retrieves the principal ID of the current identity.  
- `identity-use <identityName>` – Switches to a different identity using its name.  
- `help` – Displays help information about the available commands.  
- `cwd` – Shows the current working directory path.  


---  


## Prerequisites  

Before using this project, ensure you have the following installed:  

- [Node.js](https://nodejs.org/) (v14 or higher)  
- [npm](https://www.npmjs.com/) (v6 or higher)  
- [ic-wasm](0.9.5 or higher)
- [rustc](1.84.1 or higher)

---  

## Installation  

1. Install package :  
 ```bash  
 npm i -g icp-cli
```
1. Clone the repository: 
 ```bash  
 git clone https://github.com/ICP-hub/icp-cli.git
```

2. run dependencies:  
 ```bash  
 npm run build
```
3. run dependencies:  
 ```bash  
 npm link 
```
