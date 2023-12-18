module.exports = {
  packagerConfig: {
    appCopyright: 'Copyright © 2023 dice2o, Team Fangkehou',
    appBundleId: 'org.eu.fangkehou.binggptee',
    icon: 'icon',
    platforms: ['darwin', 'linux', 'win32'],
    arch: ['x64', 'arm64'],
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://github.com/fangkehou-team/BingGPT/raw/main/icon.ico',
        setupIcon: 'icon.ico',
        authors: 'dice2o, Team Fangkehou',
        description: 'AI-powered copilot',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'icon.icns',
        background: 'bg.png',
        overwrite: true,
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          bin: 'BingGPT',
          name: 'binggpt',
          productName: 'BingGPT',
          description: 'AI-powered copilot',
          productDescription: 'AI-powered copilot',
          version: '0.4.1',
          categories: ['Utility'],
          maintainer: 'dice2o, Team Fangkehou',
          homepage: 'https://github.com/fangkehou-team/BingGPT',
          icon: 'icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          bin: 'BingGPT',
          name: 'binggpt',
          productName: 'BingGPT',
          description: 'AI-powered copilot',
          productDescription: 'AI-powered copilot',
          version: '0.4.1',
          categories: ['Utility'],
          maintainer: 'dice2o, Team Fangkehou',
          homepage: 'https://github.com/fangkehou-team/BingGPT',
          icon: 'icon.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
  ],
}
