import getMuiTheme from 'material-ui/styles/getMuiTheme'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import * as Colors from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'

const Theme = () => {
  let overwrites = {
    "spacing": {
      "iconSize": 24,
      "desktopGutter": 24,
      "desktopGutterMore": 32,
      "desktopGutterLess": 16,
      "desktopGutterMini": 8,
      "desktopKeylineIncrement": 64,
      "desktopDropDownMenuItemHeight": 32,
      "desktopDropDownMenuFontSize": 15,
      "desktopDrawerMenuItemHeight": 48,
      "desktopSubheaderHeight": 48,
      "desktopToolbarHeight": 56
    },
    "fontFamily": "Roboto,sans-serif",
    "palette": {
      "primary1Color": "#388E3C",
      "primary2Color": "#4CAF50",
      "primary3Color": "#a5d6a7",
      "accent1Color": "#FF9800",
      "accent2Color": "#f5f5f5",
      "accent3Color": "#9e9e9e",
      "textColor": "#212121",
      "secondaryTextColor": "#757575",
      "alternateTextColor": "#ffffff",
      "canvasColor": "#ffffff",
      "alternateСanvasColor": "#212121",
      "alternate1Color": "rgba(255, 255, 255, 0.54)",
      "alternate2Color": "#f5f5f5",
      "borderColor": "#bdbdbd",
      "disabledColor": "rgba(0,0,0,0.3)",
      "pickerHeaderColor": "#388E3C",
      "clockCircleColor": "rgba(0,0,0,0.07)",
      "shadowColor": "rgba(0,0,0,1)"
    },
    "themeName": "CustonTheme",
    "themeFile": "lightTheme.json"
  }

  return getMuiTheme(baseTheme, overwrites)
}

export default Theme