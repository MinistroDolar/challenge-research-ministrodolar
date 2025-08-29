# Research Technical Challenge 🧑‍🔬

### **Objective**
Evaluate analytical, design, and data modelling skills in the context of Web3 technologies. This challenge aims to identify individuals who can provide valuable research and insights.

### **Instructions**
The following are mock scenarios. Please choose **only one** of the four options and create a new markdown in your repository explaining the different subtitles requested.

## 1. **Oracles**

**a. Analysis**: Analyze 2–3 of the most relevant oracles. For each, compare:
- Security  
- Sustainability  
- Decentralization  

**b. Design**:
- How would you design an ideal oracle from scratch in a world where gas is free?  
- How would you design an oracle from scratch in a world where gas is extremely expensive (in L1 only)?  

**c. Modelling**:
- Cost of attack and potential profit (or economic feasibility) for an attack on a lending protocol that uses Uniswap V2 (spot) and Chainlink as sources.  

## 2. **Stablecoins**

**a. Analysis**: Analyze 2–3 of the most relevant stablecoins. For each, compare:
- Backing mechanism  
- Sustainability  
- Decentralization  

**b. Design**:
- *Environment without liquidation risk*: How would you design an ideal stablecoin in a world where collateral cannot lose value?  
- *Environment with highly risky collateral*: How would you design a stablecoin from scratch in a scenario where all collateral assets are highly volatile and prone to liquidation?  

**c. Modelling**:
Model the economic feasibility (cost of attack vs. potential profit) of a specific attack on a DeFi protocol that relies on stablecoins. Your model should analyze the conditions under which an attack becomes profitable and suggest potential mitigation measures. Choose one of the following three scenarios to model and analyze:
- De-Peg of an algorithmic stablecoin.
- Oracle manipulation on a lending protocol.
- Bank run on a centralized stablecoin.

## 3. **Bridges**
**a. Analysis**:
Analyze the most relevant bridges. For each, compare each of the following:
- Security  
- Decentralization  
- Trust Assumptions

**b. Design**:
- How would you design an ideal bridge from scratch in a world where gas is free?
- How would you design a bridge from scratch in a world where gas is extremely expensive (in L1 only)?

**c. Modelling**:
- Cost of attacking a bridge with minting rights and the potential profit for the attacker.

## 4. **Privacy in the EVM: Tornado Cash & Privacy Pools**
**a. Analysis**:
Compare Tornado Cash and Privacy Pools across the following dimensions:
- Anonymity model: How each system achieves privacy and what information still leaks  
- Security: Cryptographic assumptions, attack surfaces, deanonymization vectors  
- Compliance stance: Tornado’s undifferentiated anonymity vs. Privacy Pools’ association/exclusion proofs  
- Composability: Gas costs, integration with dApps, UX implications  

**b. Design**:
- How would you design an ideal private transfer/swap system in a world where compliance is *not* a problem?  
- How would you design one in a world where compliance is a requirement (e.g. users must prove “clean” origins or credentials without revealing their identity)?  

**c. Modelling**:
- Model the cost and feasibility of deanonymizing users in Tornado-style systems (consider anonymity set size, timing, value correlation, etc.)  
- Model potential attacks on Privacy Pools-style systems and analyze the incentives for attackers or regulators  

### **General Notes**
- **Target audience**: senior Solidity devs and Web3 researchers  
- Keep it **concise and focused**  
- Use **diagrams** to explain core concepts and flows  
- Provide **data insights** where applicable  
- Modeling does **not** require validation with real numbers  

### **Evaluation Criteria**
- Depth of analysis and synthesis capacity  
- Clarity of explanations  
- Creativity in design  
- Use of data and diagrams  

⚠️ *Remember: The challenge has no time limit, and you can ask us any questions you need.*  
