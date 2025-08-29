# Bridge Attack Modeling: Cost vs. Profit Analysis

## **🎯 Attack Vectors on Bridges with Minting Rights**

### **Vector 1: Cross-Chain Message Manipulation**
**Target**: Compromise the cross-chain messaging protocol to mint tokens without proper validation.

**Real-World Examples:**
- Nomad bridge: $190M stolen https://medium.com/nomad-xyz-blog/nomad-bridge-hack-root-cause-analysis-875ad2e5aacd

**Attack Cost**: $500K - $2M (infrastructure, bribes, development)

### **Vector 2: Minting Rights Compromise**
**Target**: Gain control of minting contracts or private keys.

**Real-World Examples:**
- BNB Bridge (October 2022): exploit — Proof Verifier Bug
- Wormhole Bridge (February 2022): exploit — Signature Exploit

**Attack Cost**: $1M - $5M (bribes, social engineering, technical exploitation)

### **Vector 3: Collateral Manipulation**
**Target**: Manipulate the collateral backing mechanism.

**Real-World Examples:**
- Ronin Bridge: $625M stolen
- Harmony Bridge: $100M stolen
- Poly Network: $600M stolen

**Attack Cost**: $2M - $10M (bribes, technical exploitation)

## **💰 Economic Modeling: Real TVL Data**

### **Scenario A: Cross-Chain Message Manipulation**
**Target**: LayerZero v2 OFTs (highest TVL bridge)
- **TVL**: $3.64B
- **Maximum Stealable**: $1.82B (50% of TVL)
- **Attack Cost**: $2M
- **Net Profit**: $1.82B - $2M = $1.818B
- **ROI**: 90,900%

### **Scenario B: Collateral Manipulation**
**Target**: Portal (Wormhole) - Canonical Token Model
- **TVL**: $2.43B
- **Maximum Stealable**: $1.215B (50% of TVL)
- **Attack Cost**: $8M
- **Net Profit**: $1.215B - $8M = $1.207B
- **ROI**: 15,088%

### **Scenario C: Minting Rights Compromise**
**Target**: Portal (Wormhole)
- **TVL**: $2.43B
- **Maximum Stealable**: $1.215B (50% of TVL)
- **Attack Cost**: $5M
- **Net Profit**: $1.215B - $5M = $1.21B
- **ROI**: 24,200%

### **Scenario D: Analyzed Protocols**
**Target**: Across Protocol
- **TVL**: $67.55M
- **Maximum Stealable**: $33.78M (50% of TVL)
- **Attack Cost**: $2M
- **Net Profit**: $33.78M - $2M = $31.78M
- **ROI**: 1,589%

**Target**: Stargate v2
- **TVL**: $53.03M
- **Maximum Stealable**: $26.52M (50% of TVL)
- **Attack Cost**: $2M
- **Net Profit**: $26.52M - $2M = $24.52M
- **ROI**: 1,226%

**Target**: Everclear
- **TVL**: $1.45M
- **Maximum Stealable**: $725K (50% of TVL)
- **Attack Cost**: $500K
- **Net Profit**: $725K - $500K = $225K
- **ROI**: 45%

---

## **📈 Most Profitable Attacks (Ranked by ROI)**

1. **Cross-Chain Message Manipulation**: 90,900%+ ROI potential
2. **Minting Rights Compromise**: 24,200%+ ROI potential
3. **Collateral Manipulation**: 15,088%+ ROI potential
4. **Analyzed Protocols**: 1,589%+ ROI potential (Across), 1,226%+ ROI potential (Stargate v2)
5. **Small Protocol Attacks**: 45%+ ROI potential (Everclear)

---