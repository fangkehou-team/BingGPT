# Release 0.4.2

___this is a fix version for 0.4.1, which has blank screen bugs, please uninstall the old version before install the new version___

## What's Improved

- macOS build works again since we have changed to `electron-builder` to build the binary
- blank screen error fixed.

## What's Broken

- All the Keyboard Shortcuts, Export, Font Size settings are broken due to `iframe`. Maybe next version I will change the `iframe` to `BrowserView`, or maybe next time, next next time......

## What Changed

- the appBundleId has changed from `com.dice2o.binggpt` to `org.eu.fangkehou.binggptee`. So if you are using macOS you may have to delete the old version of this app by yourself. Please notice that if you do that, ___ALL YOUR APP DATA WILL BE DELETED___

## What Needs Help

- Logo for macOS only have 1024x1024@x1 format png, I cant find a proper tool for linux to generate an `icns` file that contains different size of the image and I don't have a MacBook, so macOS build logo may not be shown on the desktop.

If you can help me improve this app, Please contribute to this repository! Pull Request and Issue is welcome.
