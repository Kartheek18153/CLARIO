# TODO: Implement Profile Functionality in Settings

## 1. Backend Changes
- [ ] Modify `updateProfile` in `userController.js` to handle email updates
- [ ] Add `deleteAccount` function in `userController.js`
- [ ] Add delete account route in `user.js`

## 2. Frontend API Utils
- [ ] Add `updateProfile` function in `api.js`
- [ ] Add `uploadProfilePic` function in `api.js`
- [ ] Add `deleteAccount` function in `api.js`

## 3. Settings Page Updates
- [ ] Update `Settings.jsx` to use API functions instead of direct axios calls
- [ ] Handle profile picture upload separately from profile update
- [ ] Implement delete account button functionality
- [ ] Fix hardcoded URL to use environment variables

## 4. Testing
- [ ] Test profile update (username, email)
- [ ] Test profile picture upload
- [ ] Test account deletion
