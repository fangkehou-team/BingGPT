const {
    app,
    shell,
    nativeTheme,
    dialog,
    ipcMain,
    Menu,
    BrowserWindow,
} = require('electron')

const getLocal = () => {

}

const getDarkMode = (config) => {
    const theme = config.get('theme')
    const isDarkMode =
        theme === 'system'
            ? nativeTheme.shouldUseDarkColors
            : theme === 'dark'
                ? true
                : false
    return isDarkMode
}

export default { getLocal, getDarkMode };
