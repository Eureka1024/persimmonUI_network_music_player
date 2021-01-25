var page = {
    keyboard: {
        button10: { letter: "q", letterCaps: "Q", symbol: "1", symbolCaps: "1" },
        button11: { letter: "w", letterCaps: "W", symbol: "2", symbolCaps: "2" },
        button12: { letter: "e", letterCaps: "E", symbol: "3", symbolCaps: "3" },
        button13: { letter: "r", letterCaps: "R", symbol: "4", symbolCaps: "4" },
        button14: { letter: "t", letterCaps: "T", symbol: "5", symbolCaps: "5" },
        button15: { letter: "y", letterCaps: "Y", symbol: "6", symbolCaps: "6" },
        button16: { letter: "u", letterCaps: "U", symbol: "7", symbolCaps: "7" },
        button17: { letter: "i", letterCaps: "I", symbol: "8", symbolCaps: "8" },
        button18: { letter: "o", letterCaps: "O", symbol: "9", symbolCaps: "9" },
        button19: { letter: "p", letterCaps: "P", symbol: "0", symbolCaps: "0" },
        button20: { letter: "a", letterCaps: "A", symbol: "[", symbolCaps: "-" },
        button21: { letter: "s", letterCaps: "S", symbol: "]", symbolCaps: "/" },
        button22: { letter: "d", letterCaps: "D", symbol: "{", symbolCaps: ":" },
        button23: { letter: "f", letterCaps: "F", symbol: "}", symbolCaps: ";" },
        button24: { letter: "g", letterCaps: "G", symbol: "#", symbolCaps: "(" },
        button25: { letter: "h", letterCaps: "H", symbol: "%", symbolCaps: ")" },
        button26: { letter: "j", letterCaps: "J", symbol: "$", symbolCaps: '"' },
        button27: { letter: "k", letterCaps: "K", symbol: "&", symbolCaps: "<" },
        button28: { letter: "l", letterCaps: "L", symbol: "^", symbolCaps: ">" },
        button30: { letter: "Caps", letterCaps: "Caps", symbol: "Caps", symbolCaps: "Caps" },
        button31: { letter: "z", letterCaps: "Z", symbol: "*", symbolCaps: "_" },
        button32: { letter: "x", letterCaps: "X", symbol: "+", symbolCaps: "," },
        button33: { letter: "c", letterCaps: "C", symbol: "=", symbolCaps: "~" },
        button34: { letter: "v", letterCaps: "V", symbol: "|", symbolCaps: "?" },
        button35: { letter: "b", letterCaps: "B", symbol: "\\", symbolCaps: "!" },
        button36: { letter: "n", letterCaps: "N", symbol: "'", symbolCaps: "@" },
        button37: { letter: "m", letterCaps: "M", symbol: ".", symbolCaps: "`" },
        button38: { letter: "Del", letterCaps: "Del", symbol: "Del", symbolCaps: "Del" },
        button40: { letter: "#123", letterCaps: "?123", symbol: "abc", symbolCaps: "ABC" },
        button41: { letter: "Space", letterCaps: "Space", symbol: "Space", symbolCaps: "Space" },
        button42: { letter: "Enter", letterCaps: "Enter", symbol: "Enter", symbolCaps: "Enter" },
    },
    isLetter: true,
    isCaps: false,
    text: "",
    /* 此方法在第一次显示窗体前发生 */
    freshKeyboard: function() {
        var data = new Object();
        for (var btn in this.keyboard) {
            if (this.isLetter) {
                if (this.isCaps) {
                    data[btn] = { value: this.keyboard[btn].letterCaps };
                } else {
                    data[btn] = { value: this.keyboard[btn].letter };
                }
            } else {
                if (this.isCaps) {
                    data[btn] = { value: this.keyboard[btn].symbolCaps };
                } else {
                    data[btn] = { value: this.keyboard[btn].symbol };
                }
            }

        }
        this.setData(data);
        this.setData({ keyboard: { refresh: true } });
    },
    onLoad: function(event) {
        var data = new Object();
        for (var btn in this.keyboard) {
            data[btn] = { detail: this.keyboard[btn] };
        }
        this.setData(data);
        this.freshKeyboard();
        if (event) {
            this.textObj = event;
            if(typeof(event.text) == "string")
                this.text = event.text;
        }
        this.setData({ TextLabel: { value: this.text } })
    },

    /* 此方法关闭窗体前发生 */
    onExit: function(event) {},

    /* 此方法展示窗体前发生 */
    onShow: function(event) {

    },
    onBtn: function(event) {
        switch (event.target.id) {
            case "button30": //Caps 按键
                this.isCaps = !this.isCaps;
                if (this.isCaps)
                    this.setData({ button30: { norImg: "keyboardPush.9.png", downImg: "keyboardPush.9.png" } });
                else
                    this.setData({ button30: { norImg: "keyboard.9.png", downImg: "keyboard.9.png" } });
                this.freshKeyboard();
                break;

            case "button38": //Del 按键
                this.text = this.text.substr(0, this.text.length - 1);
                this.setData({ TextLabel: { value: this.text, refresh: true } })
                break;

            case "button40": //字母 字符切换
                this.isLetter = !this.isLetter;
                this.freshKeyboard();
                break;

            case "button41":
                this.text = this.text + " ";
                this.setData({ TextLabel: { value: this.text, refresh: true } })
                break;
            case "button42":
                //pm.navigateBack({ text: this.textObj });
                this.textObj.text = this.text;
                this.textObj.onChanged(this.text);
                pm.navigateBack();
                break;
            case "Cancel":
                pm.navigateBack();
                break;
            default:
                if (this.isLetter) {
                    if (this.isCaps) {
                        this.text += event.detail.letterCaps;
                    } else {
                        this.text += event.detail.letter;
                    }
                } else {
                    if (this.isCaps) {
                        this.text += event.detail.symbolCaps;
                    } else {
                        this.text += event.detail.symbol;
                    }
                }
                this.setData({ TextLabel: { value: this.text, refresh: true } })
                break;
        }

    }
};

Page(page);

page = 0;