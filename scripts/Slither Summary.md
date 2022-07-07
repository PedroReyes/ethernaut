Summary

- [solc-version](#solc-version) (2 results) (Informational)
- [external-function](#external-function) (3 results) (Optimization)

## solc-version

Impact: Informational
Confidence: High

- [ ] ID-0
      solc-0.8.10 is not recommended for deployment

- [ ] ID-1
      Pragma version[0.8.10](contracts/1_Fallback/Fallback.sol#L2) necessitates a version too recent to be trusted.
      Consider deploying with 0.6.12/0.7.6/0.8.7

contracts/1_Fallback/Fallback.sol#L2

## external-function

Impact: Optimization
Confidence: High

- [ ] ID-2
      contribute() should be declared external: - [Fallback.contribute()](contracts/1_Fallback/Fallback.sol#L18-L24)

contracts/1_Fallback/Fallback.sol#L18-L24

- [ ] ID-3
      withdraw() should be declared external: - [Fallback.withdraw()](contracts/1_Fallback/Fallback.sol#L30-L32)

contracts/1_Fallback/Fallback.sol#L30-L32

- [ ] ID-4
      getContribution() should be declared external: - [Fallback.getContribution()](contracts/1_Fallback/Fallback.sol#L26-L28)

contracts/1_Fallback/Fallback.sol#L26-L28

. analyzed (1 contracts with 80 detectors), 5 result(s) found
