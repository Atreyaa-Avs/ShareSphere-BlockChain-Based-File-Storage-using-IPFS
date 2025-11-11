# ShareSphere - Blockchain-Based File Storage using IPFS

## 📌 About

**ShareSphere** is a decentralized file storage dApp built on **IPFS**
with blockchain integration.\
It provides **secure, scalable, and censorship-resistant file storage**.
Unlike centralized clouds, ShareSphere uses a **peer-to-peer network**
to distribute files across nodes, ensuring **redundancy, integrity, and
availability**. 

### 🔐 Key Features

- **Metamask Integration** for authentication & transactions.
- **IPFS (via Pinata)** for decentralized file storage.
- **Smart Contract Controls** for file permissions.
- **Password-Protected Access** -- when a user uploads a file, they
  can set a password.
  - The password is converted to a **SHA256 hash**.
  - The uploader can share this hash key with the receiver.
  - Only the receiver with the correct key can download the file.
- **Transparency** -- uploaded filenames are **visible to everyone**.
- **Security** -- actual content is protected and accessible only with
  the correct key.

---

## ⚙️ Tech Stack

- **Frontend:** React.js / Next.js (dApp UI)
- **Backend:** Node.js + Express (API for blockchain & IPFS)
- **Blockchain:** Ethereum / Solidity Smart Contracts
- **Storage:** IPFS (via Pinata API)
- **Wallet:** Metamask

---

## 🚀 Setup & Installation

### 1️⃣ Prerequisites

- Node.js & npm installed
- Metamask browser extension installed
- Pinata account & API keys
- Local blockchain (Ganache/Hardhat)

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ShareSphere.git
cd ShareSphere
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

    PINATA_API_KEY=your_pinata_api_key
    PINATA_SECRET_API_KEY=your_pinata_secret_api_key
    CONTRACT_ADDRESS=your_deployed_contract_address

### 5️⃣ Compile & Deploy Smart Contract

Using **Hardhat** or **Truffle**:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the **contract address** to `.env`.

### 6️⃣ Start the dApp

```bash
npm start
```

---

## 📂 Usage Guide

### 🔹 Uploading a File

1.  Connect Metamask wallet.
2.  Select a file to upload.
3.  Set a password → it will be hashed with SHA256.
4.  File is uploaded to IPFS via Pinata.
5.  Transaction is recorded on blockchain with:
    - Filename (public)
    - File hash (IPFS CID)
    - Password hash

### 🔹 Sharing a File

- Send the **filename** + **password** (key) securely to the receiver.

### 🔹 Downloading a File

1.  Receiver enters the filename.
2.  Enters the shared password.
3.  System validates SHA256 hash with blockchain record.
4.  If valid → fetches file from IPFS and allows download.

---

## 🛡️ Security Considerations

- Filenames are **public**, but contents remain
  **encrypted/protected**.
- Password never stored in plain text, only its **SHA256 hash** is
  recorded.
- Ensures only users with the correct key can decrypt & download.

---

## 📖 Future Enhancements

- Multi-user access controls
- Integration with Layer-2 solutions for faster, cheaper transactions

---

## 👨‍💻 Author

- **Atreyaa Avs**\
  Built with ❤️ using Blockchain + IPFS
