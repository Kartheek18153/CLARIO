# TODO: Implement Profile Functionality in Settings

## 1. Backend Changes
- [x] Modify `updateProfile` in `userController.js` to handle email updates
- [x] Add `deleteAccount` function in `userController.js`
- [x] Add delete account route in `user.js`

## 2. Frontend API Utils
- [x] Add `updateProfile` function in `api.js`
- [x] Add `uploadProfilePic` function in `api.js`
- [x] Add `deleteAccount` function in `api.js`

## 3. Settings Page Updates
- [x] Update `Settings.jsx` to use API functions instead of direct axios calls
- [x] Handle profile picture upload separately from profile update
- [x] Implement delete account button functionality
- [x] Fix hardcoded URL to use environment variables

## 4. Testing
- [ ] Test profile update (username, email)
- [ ] Test profile picture upload
- [ ] Test account deletion
