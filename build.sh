#!/bin/bash

# Name of your app.
APP="Sizer"
# The path of you app to sign.
APP_PATH="Sizer-darwin-x64/Sizer.app"
# The path to the location you want to put the signed package.
RESULT_PATH="/Users/ruud/Downloads/$APP.pkg"

# The name of certificates you requested.
APP_KEY="Developer ID Application: Ruud Burger (6338U9TX2C)"
INSTALLER_KEY="Developer ID Installer: Ruud Burger (6338U9TX2C)"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
if [ -d "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A" ]; then
  # Signing a non-MAS build.
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Mantle.framework/Versions/A"
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/ReactiveCocoa.framework/Versions/A"
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A"
fi
codesign -fs "$APP_KEY" --entitlements parent.plist "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
