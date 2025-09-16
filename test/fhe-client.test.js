const FHEClient = require('../lib/fhe-client');

describe('FHE Client Library', function() {
  let fheClient;

  beforeEach(function() {
    fheClient = new FHEClient();
  });

  describe('Initialization', function() {
    it('should initialize successfully', async function() {
      const result = await fheClient.initialize('test-private-key-123');
      expect(result).to.be.true;
      expect(fheClient.isInitialized).to.be.true;
      expect(fheClient.userKey).to.equal('test-private-key-123');
    });

    it('should handle initialization failure gracefully', async function() {
      // Test with invalid key
      const result = await fheClient.initialize(null);
      expect(result).to.be.false;
    });
  });

  describe('Encryption/Decryption', function() {
    beforeEach(async function() {
      await fheClient.initialize('test-key');
    });

    it('should encrypt and decrypt values correctly', function() {
      const originalValue = 1000;
      const encrypted = fheClient.encrypt(originalValue);
      const decrypted = fheClient.decrypt(encrypted);
      
      expect(encrypted).to.be.a('string');
      expect(encrypted).to.match(/^0x[a-fA-F0-9]+$/);
      expect(decrypted).to.equal(originalValue);
    });

    it('should handle zero values', function() {
      const originalValue = 0;
      const encrypted = fheClient.encrypt(originalValue);
      const decrypted = fheClient.decrypt(encrypted);
      
      expect(decrypted).to.equal(originalValue);
    });

    it('should handle large values', function() {
      const originalValue = 999999999;
      const encrypted = fheClient.encrypt(originalValue);
      const decrypted = fheClient.decrypt(encrypted);
      
      expect(decrypted).to.equal(originalValue);
    });

    it('should handle decimal values', function() {
      const originalValue = 123.45;
      const encrypted = fheClient.encrypt(originalValue);
      const decrypted = fheClient.decrypt(encrypted);
      
      expect(decrypted).to.equal(originalValue);
    });

    it('should produce different encrypted values for same input', function() {
      const value = 1000;
      const encrypted1 = fheClient.encrypt(value);
      const encrypted2 = fheClient.encrypt(value);
      
      // Should be different due to timestamp and randomness
      expect(encrypted1).to.not.equal(encrypted2);
    });

    it('should throw error when not initialized', function() {
      const uninitializedClient = new FHEClient();
      
      expect(() => uninitializedClient.encrypt(1000)).to.throw('FHE client not initialized');
      expect(() => uninitializedClient.decrypt('0x123')).to.throw('FHE client not initialized');
    });
  });

  describe('AI Parameters', function() {
    beforeEach(async function() {
      await fheClient.initialize('test-key');
    });

    it('should generate encrypted AI parameters', function() {
      const params = {
        riskTolerance: 75,
        timeHorizon: 90,
        liquidityPreference: 60
      };

      const encryptedParams = fheClient.generateEncryptedAIParams(params);
      
      expect(encryptedParams).to.have.property('riskTolerance');
      expect(encryptedParams).to.have.property('timeHorizon');
      expect(encryptedParams).to.have.property('liquidityPreference');
      
      // All should be encrypted strings
      expect(encryptedParams.riskTolerance).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedParams.timeHorizon).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedParams.liquidityPreference).to.match(/^0x[a-fA-F0-9]+$/);
    });

    it('should handle edge case AI parameters', function() {
      const params = {
        riskTolerance: 0,
        timeHorizon: 1,
        liquidityPreference: 100
      };

      const encryptedParams = fheClient.generateEncryptedAIParams(params);
      
      expect(encryptedParams.riskTolerance).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedParams.timeHorizon).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedParams.liquidityPreference).to.match(/^0x[a-fA-F0-9]+$/);
    });
  });

  describe('Yield Calculations', function() {
    beforeEach(async function() {
      await fheClient.initialize('test-key');
    });

    it('should calculate encrypted yield rate', function() {
      const encryptedParams = {
        riskTolerance: '0x1234567890abcdef',
        timeHorizon: '0xfedcba0987654321',
        liquidityPreference: '0xabcdef1234567890'
      };

      const encryptedRate = fheClient.calculateEncryptedYieldRate(encryptedParams);
      
      expect(encryptedRate).to.match(/^0x[a-fA-F0-9]+$/);
    });

    it('should calculate encrypted yield', function() {
      const encryptedBalance = fheClient.encrypt(1000);
      const encryptedRate = fheClient.encrypt(105); // 5% rate
      
      const encryptedYield = fheClient.calculateEncryptedYield(encryptedBalance, encryptedRate);
      
      expect(encryptedYield).to.match(/^0x[a-fA-F0-9]+$/);
    });

    it('should handle zero balance yield calculation', function() {
      const encryptedBalance = fheClient.encrypt(0);
      const encryptedRate = fheClient.encrypt(100);
      
      const encryptedYield = fheClient.calculateEncryptedYield(encryptedBalance, encryptedRate);
      
      expect(encryptedYield).to.match(/^0x[a-fA-F0-9]+$/);
    });
  });

  describe('Balance Summaries', function() {
    beforeEach(async function() {
      await fheClient.initialize('test-key');
    });

    it('should generate balance summary correctly', function() {
      const encryptedBalance = fheClient.encrypt(1000);
      const encryptedYield = fheClient.encrypt(50);
      
      const summary = fheClient.getBalanceSummary(encryptedBalance, encryptedYield);
      
      expect(summary).to.have.property('balance', 1000);
      expect(summary).to.have.property('yield', 50);
      expect(summary).to.have.property('total', 1050);
      expect(summary).to.have.property('yieldPercentage', 5);
    });

    it('should handle zero balance summary', function() {
      const encryptedBalance = fheClient.encrypt(0);
      const encryptedYield = fheClient.encrypt(0);
      
      const summary = fheClient.getBalanceSummary(encryptedBalance, encryptedYield);
      
      expect(summary).to.have.property('balance', 0);
      expect(summary).to.have.property('yield', 0);
      expect(summary).to.have.property('total', 0);
      expect(summary).to.have.property('yieldPercentage', 0);
    });

    it('should calculate yield percentage correctly', function() {
      const encryptedBalance = fheClient.encrypt(2000);
      const encryptedYield = fheClient.encrypt(100);
      
      const summary = fheClient.getBalanceSummary(encryptedBalance, encryptedYield);
      
      expect(summary.yieldPercentage).to.equal(5); // 100/2000 * 100 = 5%
    });
  });

  describe('Error Handling', function() {
    it('should handle invalid encrypted values gracefully', function() {
      // Test with invalid hex string
      const result = fheClient.simulateDecryption('invalid-hex');
      expect(result).to.equal(0);
    });

    it('should handle empty encrypted values', function() {
      const result = fheClient.simulateDecryption('');
      expect(result).to.equal(0);
    });

    it('should handle malformed encrypted values', function() {
      const result = fheClient.simulateDecryption('0xinvalid');
      expect(result).to.equal(0);
    });
  });

  describe('Integration', function() {
    beforeEach(async function() {
      await fheClient.initialize('integration-test-key');
    });

    it('should handle complete workflow', function() {
      // 1. Generate AI parameters
      const aiParams = {
        riskTolerance: 80,
        timeHorizon: 120,
        liquidityPreference: 65
      };
      const encryptedParams = fheClient.generateEncryptedAIParams(aiParams);
      
      // 2. Encrypt stake amount
      const stakeAmount = 5000;
      const encryptedBalance = fheClient.encrypt(stakeAmount);
      
      // 3. Calculate yield rate
      const encryptedRate = fheClient.calculateEncryptedYieldRate(encryptedParams);
      
      // 4. Calculate yield
      const encryptedYield = fheClient.calculateEncryptedYield(encryptedBalance, encryptedRate);
      
      // 5. Get summary
      const summary = fheClient.getBalanceSummary(encryptedBalance, encryptedYield);
      
      // Verify all operations completed successfully
      expect(encryptedParams.riskTolerance).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedBalance).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedRate).to.match(/^0x[a-fA-F0-9]+$/);
      expect(encryptedYield).to.match(/^0x[a-fA-F0-9]+$/);
      expect(summary.balance).to.equal(stakeAmount);
      expect(summary.yield).to.be.a('number');
      expect(summary.total).to.be.a('number');
      expect(summary.yieldPercentage).to.be.a('number');
    });

    it('should handle multiple users independently', function() {
      const user1Client = new FHEClient();
      const user2Client = new FHEClient();
      
      return Promise.all([
        user1Client.initialize('user1-key'),
        user2Client.initialize('user2-key')
      ]).then(() => {
        const user1Balance = user1Client.encrypt(1000);
        const user2Balance = user2Client.encrypt(2000);
        
        // Should produce different encrypted values
        expect(user1Balance).to.not.equal(user2Balance);
        
        // But decrypt to correct values
        expect(user1Client.decrypt(user1Balance)).to.equal(1000);
        expect(user2Client.decrypt(user2Balance)).to.equal(2000);
      });
    });
  });

  describe('Performance', function() {
    beforeEach(async function() {
      await fheClient.initialize('performance-test-key');
    });

    it('should handle multiple encryption operations efficiently', function() {
      const startTime = Date.now();
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        fheClient.encrypt(i);
      }
      
      const duration = Date.now() - startTime;
      expect(duration).to.be.lessThan(1000); // Less than 1 second
    });

    it('should handle large batch operations', function() {
      const startTime = Date.now();
      const values = Array.from({ length: 50 }, (_, i) => i * 100);
      
      values.forEach(value => {
        const encrypted = fheClient.encrypt(value);
        const decrypted = fheClient.decrypt(encrypted);
        expect(decrypted).to.equal(value);
      });
      
      const duration = Date.now() - startTime;
      expect(duration).to.be.lessThan(500); // Less than 0.5 seconds
    });
  });
});
