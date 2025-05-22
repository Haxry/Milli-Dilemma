# 💰 Millionaire’s Dilemma

A secure game using [Inco Lightning](https://docs.inco.org/lightning/) that allows three participants (Alice, Bob, and Eve) to secretly submit their balances on-chain — without revealing the values — and determine who is the richest among them. Inspired by the classic *Millionaires' Problem* in cryptography.

---

## ⚡ How it Works

The core contract, [`RichestComparison`](https://github.com/Haxry/Milli-Dilemma/blob/master/lightning-rod/contracts/src/Rich.sol), is built using Inco Lightning, a library that allows encrypted computation on-chain. Participants submit encrypted values, and comparison is done securely using `euint256` and `ebool` types. No private value is ever revealed.

### 🧠 Flow
![Screenshot 2025-05-23 014643](https://github.com/user-attachments/assets/0d01d0cc-a65c-4592-9967-518f06e8206d)


1. **Deploy the contract** with Alice, Bob, and Eve’s wallet addresses.
2. Each participant **submits their encrypted balance** through the frontend.
3. After all submissions:
   - Anyone can click **"Compare"** to compute the richest participant.
   - Then click **"Reveal Winner"** to decrypt and finalize the result.
4. The result is emitted and stored publicly — but without revealing any actual submitted values.

---

## 🔐 Inco Lightning Usage

This project uses [Inco Lightning](https://github.com/inco-org/inco-lightning) to:

- Accept encrypted values 
- Perform encrypted comparison 
- Allow contract to read/write encrypted data securely 

Lightning ensures sensitive information is kept private, while still allowing secure operations on-chain.

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/Haxry/Milli-Dilemma.git

# Navigate to the frontend folder
cd Milli-Dilemma/frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
