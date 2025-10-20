# 🌟 Cipher Kind Glow

> **Revolutionary FHE-Powered Donation Platform**

A cutting-edge charitable giving platform that leverages Fully Homomorphic Encryption (FHE) technology to ensure complete privacy and security for all donations while maintaining transparency in impact tracking.

## 🎥 Demo Video

- Inline (repository): [`cipher-kind-glow.mp4`](./cipher-kind-glow.mp4)
- Recommended: upload this asset to Releases or a CDN and paste the link here for faster streaming.

## 🔗 Deployed Contract (Sepolia)

- Contract: `0x5FE0dcf60cFf2adE7552A0E8C3f2f759A980817c`
- Initialized Campaign IDs:
  - `0xe36c37699c17bb7407d6b3ea58ffb54319cfe8969375f3d3ef2ff1e22d7bae33`
  - `0xa27a0c04b63c6f6537a49752fc414a4abdb2c57888c73ef13a41e9473f8de2f3`
  - `0x216de87f94bac87c3a227611c0bbc138d107d4d4ed3de792a507b56e65b85d0f`

## 🔐 Encryption Flow (End-to-End)

1. Wallet connects (RainbowKit/Wagmi) and Zama Relayer SDK initializes (SepoliaConfig).
2. User inputs donation amount (in yuan). Frontend creates encrypted input:
   - `const input = instance.createEncryptedInput(CONTRACT_ADDRESS, userAddress)`
   - `input.add32(BigInt(amount))` → `const enc = await input.encrypt()`
3. Frontend calls contract with FHE payload:
   - `makeDonation(campaignId, enc.handles[0], enc.inputProof)`
4. Contract converts to internal FHE type and stores the encrypted donation:
   - `FHE.fromExternal(_encryptedAmount, _inputProof)`
5. Public stats (counts only) are updated on-chain to avoid exposing amounts:
   - `donorCount` (unique donors), `donationCount` (total donations)
6. Frontend reads campaign data; donation counts are displayed immediately.
7. (Optional) For totals, use `FHE.reencrypt` + `instance.userDecrypt` if/when you decide to display decrypted aggregates under proper ACL.

## ✨ Key Features

- **🔐 FHE-Encrypted Donations**: All donation amounts and donor information are encrypted using state-of-the-art Fully Homomorphic Encryption
- **🛡️ Privacy-First Architecture**: Donor identities and contribution amounts remain completely private throughout the process
- **📊 Transparent Impact**: Track how donations are utilized without compromising donor privacy
- **🔗 Multi-Wallet Support**: Seamless integration with popular Web3 wallets including Rainbow, MetaMask, and more
- **📈 Real-time Analytics**: View encrypted donation statistics and impact metrics
- **🌐 Decentralized**: Built on Ethereum Sepolia testnet for maximum security and transparency

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **Web3 Integration**: RainbowKit, Wagmi, Viem
- **Encryption**: Zama FHE Oracle Solidity
- **Blockchain**: Ethereum Sepolia Testnet
- **Deployment**: Vercel

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/0Xandreymironov/cipher-kind-glow.git

# Navigate to the project directory
cd cipher-kind-glow

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

## 🔧 Smart Contract

The platform utilizes FHE-enabled smart contracts to ensure all donation data remains encrypted while still allowing for transparent impact tracking and fund allocation.

### Key Contract Features:
- Encrypted donation amounts using FHE
- Private donor information protection
- Transparent fund allocation mechanisms
- Automated impact reporting
- Campaign management system

## 📦 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure build settings for Vite

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Ensure `VITE_` prefix for all client-side variables

3. **Deploy**
   - Automatic deployment on push to main branch
   - Manual deployment available in dashboard

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your preferred hosting platform
npm run deploy
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our developer community discussions

## 🔗 Links

- **Live Demo**: [cipher-kind-glow.vercel.app](https://cipher-kind-glow.vercel.app)
- **GitHub Repository**: [github.com/0Xandreymironov/cipher-kind-glow](https://github.com/0Xandreymironov/cipher-kind-glow)
- **Documentation**: [docs.cipherkindglow.com](https://docs.cipherkindglow.com)

---

**Built with ❤️ by the Cipher Kind Glow Team**

*Empowering privacy-preserving philanthropy through cutting-edge encryption technology*