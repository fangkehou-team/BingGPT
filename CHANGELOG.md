# Release 0.4.1

## What's Improved

- A new Logo!!! Now `BingGPT` is becoming the wrapper of `Copilot with Bing Chat` (Although the app name won't change)
- A new Logo for macOS Platform which meets Apple's design guide
- A new wrapper written in Vue has been included in order to recover the function of bingGPT and provides a user-friendly interface instead of just right click.

## What's Broken

- All the Keyboard Shortcuts, Export, Font Size settings are broken due to `iframe`. Maybe next version I will change the `iframe` to `BrowserView`, or maybe next time, next next time......

## What Changed

- the appBundleId has changed from `com.dice2o.binggpt` to `org.eu.fangkehou.binggptee`. So if you are using macOS you may have to delete the old version of this app by yourself. Please notice that if you do that, ___ALL YOUR APP DATA WILL BE DELETED___

## What Needs Help

- Logo for macOS only have 1024x1024@x1 format, I cant find a proper tool for linux to generate an `icns` file that contains different size of the image and I don't have a MacBook.
- GitHub Action build for macOS always fails, so no binary for macOS were produced. It will remain if electron forge or node-gyp has not solved it.

If you can help me improve this app, Please contribute to this repository! Pull Request and Issue is welcome.
