# Emergency Procedures

## Loss of Control Signal

```
Symptoms: Transmitter beeping, "RC Lost" message

Automated Response:
- After timeout, failsafe triggers
- NAV_RCL_ACT executes (default: Return to Land)

Pilot Response:
1. Check transmitter power
2. Allow failsafe to execute
3. Monitor RTL progress
```

## Low Battery

```
Warning Levels:
- Low: Plan to land within 2 minutes
- Critical: Return to land automatically
- Emergency: Immediate landing

Pilot Response:
1. Acknowledge warning
2. Reduce power consumption
3. Head to landing zone
4. Land immediately
```

## Motor Failure

```
Single Motor Failure (Hex/Octo):
- May allow controlled flight
- Land immediately

Single Motor Failure (Quad):
- Catastrophic loss of control
- Activate emergency descent
- Cut throttle before impact
```
