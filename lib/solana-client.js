const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } = require('@solana/spl-token');

class SolanaClient {
  constructor(rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.keypair = null;
  }

  async initialize(privateKey) {
    try {
      // Convert private key to Keypair
      const secretKey = Buffer.from(privateKey, 'base64');
      this.keypair = Keypair.fromSecretKey(secretKey);
      console.log('Solana client initialized with address:', this.keypair.publicKey.toString());
      return true;
    } catch (error) {
      console.error('Failed to initialize Solana client:', error);
      return false;
    }
  }

  async getBalance() {
    if (!this.keypair) throw new Error('Solana client not initialized');
    
    try {
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async createTokenAccount(mintAddress) {
    if (!this.keypair) throw new Error('Solana client not initialized');
    
    try {
      const mint = new PublicKey(mintAddress);
      const associatedTokenAddress = await getAssociatedTokenAddress(mint, this.keypair.publicKey);
      
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          this.keypair.publicKey, // payer
          associatedTokenAddress, // associatedToken
          this.keypair.publicKey, // owner
          mint // mint
        )
      );

      const signature = await this.connection.sendTransaction(transaction, [this.keypair]);
      await this.connection.confirmTransaction(signature);
      
      return {
        success: true,
        tokenAccount: associatedTokenAddress.toString(),
        signature
      };
    } catch (error) {
      console.error('Failed to create token account:', error);
      return { success: false, error: error.message };
    }
  }

  async transferSOL(toAddress, amount) {
    if (!this.keypair) throw new Error('Solana client not initialized');
    
    try {
      const toPublicKey = new PublicKey(toAddress);
      const lamports = Math.floor(amount * 1e9); // Convert SOL to lamports
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.keypair.publicKey,
          toPubkey: toPublicKey,
          lamports
        })
      );

      const signature = await this.connection.sendTransaction(transaction, [this.keypair]);
      await this.connection.confirmTransaction(signature);
      
      return {
        success: true,
        signature,
        amount
      };
    } catch (error) {
      console.error('Failed to transfer SOL:', error);
      return { success: false, error: error.message };
    }
  }

  async getTokenBalance(mintAddress) {
    if (!this.keypair) throw new Error('Solana client not initialized');
    
    try {
      const mint = new PublicKey(mintAddress);
      const associatedTokenAddress = await getAssociatedTokenAddress(mint, this.keypair.publicKey);
      
      const tokenAccountInfo = await this.connection.getTokenAccountBalance(associatedTokenAddress);
      return tokenAccountInfo.value.uiAmount || 0;
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return 0;
    }
  }

  async createCrossChainSwap(ethereumTxHash, amount, tokenMint) {
    if (!this.keypair) throw new Error('Solana client not initialized');
    
    try {
      // This would integrate with a cross-chain bridge contract
      // For now, we'll simulate the process
      const transaction = new Transaction();
      
      // Add instructions for cross-chain swap
      // This would typically involve:
      // 1. Locking tokens on Solana
      // 2. Emitting events for bridge validators
      // 3. Creating proof of transaction
      
      const signature = await this.connection.sendTransaction(transaction, [this.keypair]);
      await this.connection.confirmTransaction(signature);
      
      return {
        success: true,
        signature,
        ethereumTxHash,
        amount,
        tokenMint
      };
    } catch (error) {
      console.error('Failed to create cross-chain swap:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SolanaClient;

