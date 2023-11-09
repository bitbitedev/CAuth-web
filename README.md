# C-Auth
This project is meant to improve the authentication process for users and developers in terms of security and usability.
Authentication should be proof-of-ownership, not proof-of-knowledge. This project aims to achieve this by using a combination of biometrics and cryptography.
Insted of having to remember a password, users will be able to use their fingerprint, face id or for example physical keys to authenticate themselves.

To achieve this, C-Auth uses the webauthn standard. This standard is supported by most modern browsers and operating systems.
Users will only need to register once at C-Auth and will be able to use this account on each platform that supports C-Auth.

Additionally C-Auth aims to make it as transparent as possible who accessed your data and when. You will be able to see all active sessions with the ability to revoke them at any time. This means you can see if someone else is using your account and revoke their access.

## What this means
- No more passwords
- No more stolen accounts
- No more trying to remember login information

## Why this is better than passwords
### Passwords can be guessed
Passwords can be guessed by brute force, which means that an attacker tries all possible combinations of characters until the correct password is found.
This is why passwords need to be long and complex, which makes them hard to remember.
Biometrics are harder to guess, because they are unique for each person.

### Passwords can be stolen
Passwords can be stolen by phishing, keyloggers, data breaches and more.
Biometrics are stored locally on the device of the user, so they can't be stolen.

### Passwords are hard to remember
Passwords are hard to remember, especially if you have a different password for each account.
Biometrics are easy to remember, because they are unique for each person.

## Why this is better than other biometric authentication methods
### Other biometric authentication methods are not supported by all devices
This project uses the webauthn standard, which is supported by most modern browsers and operating systems.
This means that users will be able to use this method on most devices.

### Other biometric authentication methods require a device to be present
Users will need to have their phone or other device with them to authenticate themselves.
This project does not require any additional devices, because it uses the biometrics of the user's device.

### Other biometric authentication methods can be faked
Other biometric authentication methods can be faked, for example with a picture of the user's face.
This project uses the webauthn standard, which uses hardware sensors to authenticate the user.
This means that users will need to use their fingerprint, face id or physical key to authenticate themselves.