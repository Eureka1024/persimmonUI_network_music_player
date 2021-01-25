var page = {
    /* 此方法在第一次显示窗体前发生 */
    onLoad: function (event) {
        this.loadCustomPanel(); //将所有的自定义面板加载
        this.wifiInit();
        this.audioInit();
    },

    /* 此方法展示窗体后发生 */
    onResume: function (event) {

    },

    /* 当前页状态变化为显示时触发 */
    onShow: function (event) {

    },

    /* 当前页状态变化为隐藏时触发 */
    onHide: function (event) {

    },

    /* 此方法关闭窗体前发生 */
    onExit: function (event) {

    },

    /*------------------------- wifi 相关定义 ------------------------------*/
    // wifi初始化
    wifiInit: function () {
        /* WIFI 相关  仿真会出错，不建议仿真*/
        var that = this;
        wifi = pm.createWifi(); // WiFi 对象实例化      
        wifi.scan();//扫描wifi
        //监听扫描 WiFi 结束事件
        wifi.onScanEvent(function (res) {
            if (res) { //意味着扫描结束
                //将得到的wifi名显示
                that.wifiArray = res;
                var obj = { };
                for (var i = 0; i < 10; i++) {
                    obj['wifiSSIDButton' + i] = { value: res[i].ssid };
                }
                that.setData(obj);
            } else {
                console.log("WiFi cannot be scanned.");
            }
        });
        //监听网络连接事件
        that = this;
        wifi.onNetworkEvent(function (res) {
            var obj = {};
            for (var i = 0; i < 10; ++i) {//将所有wifi指示图标清零
                obj["wifiImage" + i] = { value: 'wifilog1.png' };
            }
            that.setData(obj);
            if (res) {
                console.log("Network is connected");    //此时意味着wifi成功连接到网络
                console.log(wifi.getConnected());       //获取连接的wifi信息
                //将连接成功的wifi显示连接图标
                obj = {};
                obj["wifiImage" + (that.wifiObj.num)] = { value: 'blueHook.png' };
                that.setData(obj);
            } else {
                console.log("Network is connected fail");
            }
        });
    },
    //wifi对象
    wifiObj: {
        name: "未连接",
        password: 12345678,
        num: 0
    },
    wifiArray: 0, //用于存储wifi内容
    //点击后，显示输入密码连接界面
    wifiOnBtn: function (event) {
        this.wifiObj.num = parseInt(event.target.id[event.target.id.length - 1]); //得到wifi所处的位置
        this.wifiObj.name = this.wifiArray[this.wifiObj.num].ssid; //得到点击wifi名字
        this.setData({ wifiTextbox: { value: '' } });   //将文本上次留存的密码清空
        this.setData({ wifiPassWordPanel: { visible: true } }); //显示输入密码面板
        this.setData({ wifiNamelabelPW: { value: this.wifiObj.name } }); //加入密码名字
    },
    //输入密码
    onWifiTextChange: function (event) {
        this.wifiObj.password = event.detail.value;//得到密码
    },
    //输入密码后连接
    wifiConnectOnBtn: function (event) {
        if (event.target.id == "wifiEntrybutton") {
            if (wifi.getConnected()) {
                if (wifi.disconnect()) {  //先将wifi断开连接，重复连接会卡死
                    console.log("disconnect success")
                    this.setData({ wifiPassWordPanel: { visible: false } }); //设置不可视
                    wifi.connect({ ssid: this.wifiObj.name, password: this.wifiObj.password })
                } else {
                    console.log("disconnect fail")
                }
            } else {
                this.setData({ wifiPassWordPanel: { visible: false } }); //设置不可视
                wifi.connect({ ssid: this.wifiObj.name, password: this.wifiObj.password })
            }

        } else {
            this.setData({ wifiPassWordPanel: { visible: false } }); //设置不可视
        }
    },


    /*------------------------ audio 相关初始化 -----------------------------*/
    //进度条对象
    ProgressObj: {
        total: 1,
        current: 1
    },
    //播放进度控制
    playOnSlider: function (event) {
        console.log(event.detail.value);
        if (currentSongInfo.source == "localSources") {
            this.ProgressObj.current = event.detail.value / 1000 * LocalMusicArray[currentSongInfo.num].length; //得到跳转的秒数
        } else {
            this.ProgressObj.current = event.detail.value / 1000 * OnlineMusicArray[currentSongInfo.num].length; //得到跳转的秒数
        }
        audio.seek(this.ProgressObj.current);
        var min = parseInt(this.ProgressObj.current / 60); //只保留整数位
        var sec = this.ProgressObj.current % 60; //取余得到秒数
        if (min < 10) min = '0' + min;
        if (sec < 10) sec = '0' + sec;
        this.setData({ playPgLabel: { value: min + ":" + sec } }); //设定显示值
        // that.setData({ playPgBarSlider: { value: (ProgressObj.current / ProgressObj.total) * 1000 } });
        // audio.setVolume(event.detail.value);
        // this.setData({ volValueLabel: { value: event.detail.value } });
    },
    audioInit: function () {
        var that = this;
        audio = pm.createAudioContext(); //audio 实例化
        audio.setVolume(50);        //音量控制初始化
        this.setData({ volValueLabel: { value: 50 } });
        this.setData({ volumeSlider: { value: 50 } });
        audio.setUrl(currentSongInfo.src); //设置播放路径
        //设置监听音频播放进度事件（大概每秒调用一次）
        audio.onTimeUpdate(function (xmS) {
            that.ProgressObj.current = Math.round(xmS / 1000); //转化成秒
            var min = parseInt(that.ProgressObj.current / 60); //只保留整数位
            var sec = that.ProgressObj.current % 60; //取余得到秒数
            if (min < 10) min = '0' + min;
            if (sec < 10) sec = '0' + sec;
            that.setData({ playPgLabel: { value: min + ":" + sec } }); //设定显示值
            if (currentSongInfo.source == "localSources") {
                that.setData({ playPgBarSlider: { value: (that.ProgressObj.current / LocalMusicArray[currentSongInfo.num].length) * 1000 } });
            } else {
                that.setData({ playPgBarSlider: { value: (that.ProgressObj.current / OnlineMusicArray[currentSongInfo.num].length) * 1000 } });
            }
        });
        // //设置获取播放音频文件的时长的回调函数（每次audio.play的时候会被调用一次）//目前该方法得到的值还不是准确，只能预先在数组里定义了
        // audio.onPlay(function (xS) {
        //     console.log("==> onPlay : " + xS);
        //     that.ProgressObj.total = xS; //单位为秒
        // });
        //音乐播放结束回调
        audio.onEnded(function () {
            console.log(currentSongInfo.source)
            that.setData({ playPgBarSlider: { value: 1000 } }); //进度条直接满格
            that.nextSong();
        });
    },



    /*------------------- 音乐播放控制 ---------------------------------------------------------*/
    //下一首播放（多处使用到）
    nextSong: function () {
        audio.stop(); //要先停止当前歌曲    
        if (currentSongInfo.source == "localSources") {//本地资源
            if (currentSongInfo.num == (LocalMusicArray.length - 1)) {
                currentSongInfo.num = 0;
            } else {
                currentSongInfo.num++;
            }
            currentSongInfo.src = LocalMusicArray[currentSongInfo.num].src;
            currentSongInfo.name = LocalMusicArray[currentSongInfo.num].name;
        } else { //网络资源 NetworkSources 
            if (currentSongInfo.num == (OnlineMusicArray.length - 1)) {
                currentSongInfo.num = 0;
            } else {
                currentSongInfo.num++;
            }
            currentSongInfo.id = OnlineMusicArray[currentSongInfo.num].id;
            currentSongInfo.name = OnlineMusicArray[currentSongInfo.num].name;
            currentSongInfo.singer = OnlineMusicArray[currentSongInfo.num].singer;
            currentSongInfo.src = "http://music.163.com/song/media/outer/url?id=" + currentSongInfo.id;//得到网络播放路径
        }
        //更新到播放界面
        this.setData({ curMusiclabel: { value: currentSongInfo.name } });
        audio.setUrl(currentSongInfo.src);
        audio.play(); //播放音乐

        this.setData({ playSwitch: { value: true } }); //设置播放按钮打开
    },
    //播放控制按键触发
    onBtn: function (event) {
        switch (event.target.id) {
            case "playSwitch": //播放按键
                if (event.detail.value == true) {
                    audio.play();
                } else {
                    audio.pause();
                }
                break;
            case "pre": //上一曲
                audio.stop(); //要先停止当前歌曲    
                if (currentSongInfo.source == "localSources") {//本地资源
                    if (currentSongInfo.num == 0) {
                        currentSongInfo.num = LocalMusicArray.length - 1;
                    } else {
                        currentSongInfo.num--;
                    }
                    currentSongInfo.src = LocalMusicArray[currentSongInfo.num].src;
                    currentSongInfo.name = LocalMusicArray[currentSongInfo.num].name;
                } else { //网络资源 NetworkSources 
                    if (currentSongInfo.num == 0) {
                        currentSongInfo.num = OnlineMusicArray.length - 1;
                    } else {
                        currentSongInfo.num--;
                    }
                    currentSongInfo.id = OnlineMusicArray[currentSongInfo.num].id;
                    currentSongInfo.name = OnlineMusicArray[currentSongInfo.num].name;
                    currentSongInfo.singer = OnlineMusicArray[currentSongInfo.num].singer;
                    currentSongInfo.src = "http://music.163.com/song/media/outer/url?id=" + currentSongInfo.id;//得到网络播放路径
                }
                //更新到播放界面
                this.setData({ curMusiclabel: { value: currentSongInfo.name } });
                audio.setUrl(currentSongInfo.src);
                audio.play(); //播放音乐

                this.setData({ playSwitch: { value: true } }); //设置播放按钮打开
                break;
            case "next": //下一曲
                this.nextSong();
                break;
            case "singleReturnBtn":     //关闭歌词界面
                this.setData({ singlePanel: { visible: false }, });
                break;
            default:
                break;
        }
    },


    /*--------------------- 点击列表的音乐开始图标时 更新当前音乐曲目 ----------------------------*/
    onMusicPlay: function (event) {
        audio.stop(); //要先停止当前歌曲
        if (event.target.id[0] == 'l') {  //本地音乐(取button控件名首字母)
            //更新当前歌曲信息
            currentSongInfo.num = parseInt(event.target.id[event.target.id.length - 1]); //得到当前播放路径的序号
            currentSongInfo.src = LocalMusicArray[currentSongInfo.num].src;
            currentSongInfo.name = LocalMusicArray[currentSongInfo.num].name;
        } else if (event.target.id[0] == 'n') { //网络音乐
            currentSongInfo.num = parseInt(event.target.id[event.target.id.length - 1]); //得到当前播放路径的序号
            currentSongInfo.id = OnlineMusicArray[currentSongInfo.num].id;
            currentSongInfo.name = OnlineMusicArray[currentSongInfo.num].name;
            currentSongInfo.singer = OnlineMusicArray[currentSongInfo.num].singer;
            currentSongInfo.src = "http://music.163.com/song/media/outer/url?id=" + currentSongInfo.id;//得到网络播放路径
        }

        //更新到播放界面
        this.setData({ curMusiclabel: { value: currentSongInfo.name } });
        audio.setUrl(currentSongInfo.src);
        audio.play(); //播放音乐
        this.setData({ playSwitch: { value: true } }); //设置播放按钮打开
    },

    /*------------------------- 功能区切换 ----------------------------*/
    // 隐藏所有功能区的自定义面板
    hideAllPanel: function () {
        this.setData({
            menuPanel: { visible: false },
            recommendPanel: { visible: false },
            localMusicPanel: { visible: false },
            onlineMusicPanel: { visible: false },
            setPanel: { visible: false },
            volumePanel: { visible: false },
            wifiPassWordPanel: { visible: false },
            singlePanel: { visible: false }
        });
    },
    onAppCIbindtap: function (event) {
        this.hideAllPanel();//先隐藏所有自定义面板
        //选择界面
        switch (event.detail.value) { //控件有点问题，图片名对不上
            case "onlineMusic":
                this.setData({ recommendPanel: { visible: true } });    //推荐界面
                break;
            case "setting":
                this.setData({ localMusicPanel: { visible: true } });   //本地音乐界面
                currentSongInfo.source = "localSources";
                currentSongInfo.num = 0;
                break;
            case "recommend":
                this.setData({ onlineMusicPanel: { visible: true } });  //在线音乐界面
                currentSongInfo.source = "NetworkSources";
                currentSongInfo.num = 0;
                break;
            case "localMusic":
                this.setData({ setPanel: { visible: true } });          //设置界面
                break;
            default:
                break;
        }
    },

    /*------------------------- 单曲界面浏览 ----------------------------*/
    singleSwitch: function (event) {
        this.setData({ singlePanel: { visible: true } });     //单曲音乐界面
        audio.pause();  //先暂停，不然会卡死（此时网络音乐播放和http同时请求）

        this.setData({ lyricMultiTextBox: { automatic: true } });   /* 使能根据行数调整控件高度 */
        this.setData({ singleNameLabel: { value: currentSongInfo.name } });
        this.setData({ artistsLabel: { value: currentSongInfo.singer } });

        //获取歌词
        var that = this;
        var http = require('http');
        var lyricUrl = "https://music.163.com/api/song/lyric?id=" + currentSongInfo.id + "&lv=1&kv=1&tv=-1";
        http.request({
            url: lyricUrl, //歌词url
            method: "GET",
            success: function (res) {
                // console.log(res.data); 
                var jnews = res.data.jsonParse();
                var lyricData = jnews.lrc.lyric;
                // lyricData.replace(/\[.*?\]/g, '');  //目前无法使用正则表达式
                that.setData({ lyricMultiTextBox: { value: lyricData } });
                //获取歌词成功后，获取评论
                that.setData({ commentListctrl: { visible: true } }); //先设置为可视
                var http1 = require('http');
                var commentUrl = "http://music.163.com/api/v1/resource/comments/R_SO_4_" + currentSongInfo.id + "?limit=1&offset=0";
                http1.request({
                    url: commentUrl, //评论url
                    method: "GET",
                    success: function (res) {
                        var jnews = res.data.jsonParse();
                        var comments = [];
                        for (var i = 0; i < 5; i++) {
                            comments[i] = {
                                userName: jnews.hotComments[i].user.nickname,
                                comment: jnews.hotComments[i].content
                            };
                        }
                        var nameObj = {};
                        var commentObj = {};
                        for (var i = 0; i < 5; i++) {
                            nameObj['userNameLabel' + i] = { value: comments[i].userName };
                            commentObj['commetMultiTextBox' + i] = { value: comments[i].comment };
                        }
                        that.setData(nameObj); //设置用户名
                        that.setData(commentObj); //设置该用户的评论
                        audio.play(); //播放音乐
                    }
                });
            }
        });
    },


    /*------------------------- 网络音乐搜索 ----------------------------*/
    searchMusicText: 0, //用于存储控件textbox的文本数据
    //控件textbox获取输入文本数据
    onTextChange: function (event) {
        searchMusicText = event.detail.value; //获取Textbox的当前文本内容
    },
    //控件button触发http请求音乐数据
    onSearch: function (event) {
        var songName = encodeURI(searchMusicText);//中文识别不了，需要先将汉字转换成编码才能使用  
        var that = this;
        var http = require('http');
        http.request({
            url: 'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={' + songName + '}&type=1&offset=0&total=true&limit=5', //只获取五组数据
            method: "GET",
            success: function (res) {
                var jnews = res.data.jsonParse();
                //解析json数据并放入在线音乐列表数组
                for (var i = 0; i < OnlineMusicArray.length; i++) {
                    OnlineMusicArray[i].name = jnews.result.songs[i].name;
                    OnlineMusicArray[i].id = jnews.result.songs[i].id;
                    OnlineMusicArray[i].singer = jnews.result.songs[i].artists[0].name;
                    OnlineMusicArray[i].length = (jnews.result.songs[i].duration) / 1000; //得到的是毫秒，转换成秒
                }
                //放入播放列表
                var obj = { };
                for (var i = 0; i < OnlineMusicArray.length; i++) {
                    obj['netMusicLabel' + i] = { value: OnlineMusicArray[i].name };
                }
                that.setData(obj);

                console.log(OnlineMusicArray)
            }
        })
    },

    /*------------------------- 音量大小控制 ----------------------------*/
    //显示音量条面板
    VolumeBtn: function (event) {
        if (event.detail.value == true) {
            this.setData({ volumePanel: { visible: true } }); //设置可视
        } else {
            this.setData({ volumePanel: { visible: false } }); //隐藏
        }
    },
    // 音量进度条调节
    volumeOnSlider: function (event) {
        audio.setVolume(event.detail.value);
        this.setData({ volValueLabel: { value: event.detail.value } });
    },


    /*------------------ menuPanel界面显示控制 --------------------------*/
    menuChoose: function (event) {
        if (event.detail.value == true) {
            this.setData({ menuPanel: { visible: true } });  //设置可视
        } else {
            this.setData({ menuPanel: { visible: false } }); //设置不可视
        }
    },


    /*------------------------- 加载自定义面板 ----------------------------*/
    //将本地歌曲加载到面板的列表
    loadLocalMusicList: function () {
        var musicList = new Array();
        for (var i = 0, len = LocalMusicArray.length; i < len; i++) {
            var Item = new Object();
            //重新给要加载的自定义面板的控件重新命名
            Item.label1 = { id: "localMusicLabel" + i, value: LocalMusicArray[i].name };
            Item.button1 = { id: "localMusicButton" + i };
            musicList.push(Item)
        }
        this.setData({
            localList: {
                list: {
                    page: this,
                    items: [{
                        xml: "Panels/MusicItem",
                        items: musicList
                    }]
                }
            }
        })
    },
    //将在线歌曲加载到面板的列表
    loadOnlineMusicList: function () {
        var musicList = new Array();
        for (var i = 0, len = OnlineMusicArray.length; i < len; i++) {
            var Item = new Object();
            //重新给要加载的自定义面板的控件重新命名
            Item.label1 = { id: "netMusicLabel" + i, value: OnlineMusicArray[i].name };
            Item.button1 = { id: "netMusicButton" + i };
            musicList.push(Item)
        }
        this.setData({
            netList: {
                list: {
                    page: this,
                    items: [{
                        xml: "Panels/MusicItem",
                        items: musicList
                    }]
                }
            }
        })
    },

    //加载评论区列表
    loadCommentList: function () {
        var CommentList = new Array();
        for (var i = 0, len = 5; i < len; i++) { //5个评论即可
            var Item = new Object();
            //重新给要加载的自定义面板的控件重新命名
            Item.imagebox1 = { id: "userImage" + i };
            Item.label1 = { id: "userNameLabel" + i, value: "未知" };
            Item.MultiTextBox1 = { id: "commetMultiTextBox" + i, value: "未知" };
            CommentList.push(Item)
        }
        this.setData({
            commentListctrl: {
                list: {
                    page: this,
                    items: [{
                        xml: "Panels/CommentPanel",
                        items: CommentList
                    }]
                }
            }
        })
        this.setData({ commentListctrl: { visible: false } }); //先设置不可视
    },

    //加载扫描到的WiFi列表
    loadWiFiList: function () {
        var wifiList = new Array();
        for (var i = 0, len = 10; i < len; i++) { //10个wifi即可
            var Item = new Object();
            //重新给要加载的自定义面板的控件重新命名
            Item.imagebox1 = { id: "wifiImage" + i };
            Item.button1 = { id: "wifiSSIDButton" + i, value: "未知" };
            //Item.MultiTextBox1 = { id: "commetMultiTextBox" + i, value: "未知" };
            wifiList.push(Item)
        }
        this.setData({
            wifiListctrl: {
                list: {
                    page: this,
                    items: [{
                        xml: "Panels/WiFiItem",
                        items: wifiList
                    }]
                }
            }
        })
    },

    //加载所有的自定义面板
    loadCustomPanel: function () {
        //个性推荐：在page中显示自定义面板  注意避免重复
        this.setData({
            main_page: {    /* page id */
                item: [{    /* item 属性，数组 */
                    xml: 'Panels/recommendPanel',   /* xml 属性，自定义面板 URL */
                    items: [                        /* items 属性，数组 */
                        /* 添加自定义面板 recommendPanel 到 page 中，并修改 id 为 recommendPanel */
                        { recommendPanel: { id: "recommendPanel", background: 0x00FF0000, position: { x: 0, y: 0 } } },
                    ]
                }]
            }
        });
        this.setData({ recommendPanel: { visible: true } }); //设置可视
        this.setData({ HPanimatedImage: 'start' });

        //本地音乐：在page中显示自定义面板  注意避免重复
        this.setData({
            main_page: {    /* page id */
                item: [{     /* item 属性，数组 */
                    xml: 'Panels/localMusicPanel',  /* xml 属性，自定义面板 URL */
                    items: [                    /* items 属性，数组 */
                        /* 添加自定义面板 localMusicPanel 到 page 中 */
                        { localMusicPanel: { background: 0x00FF0000, position: { x: 0, y: 0 } }, hide: true },
                    ]
                }]
            }
        });
        this.loadLocalMusicList();  //将音乐载入列表
        this.setData({ localMusicPanel: { visible: false } }); //先设置不可视


        //网络音乐界面
        this.setData({
            main_page: {    /* page id */
                item: [{     /* item 属性，数组 */
                    xml: 'Panels/onlineMusicPanel',       /* xml 属性，自定义面板 URL */
                    items: [                    /* items 属性，数组 */
                        /* 添加自定义面板 onlineMusicPanel 到 page 中，并修改 id 为 onlineMusicPanel */
                        { onlineMusicPanel: { id: "onlineMusicPanel", background: 0x00FF0000, position: { x: 0, y: 0 } } },
                    ]
                }]
            }
        });
        this.loadOnlineMusicList();  //将音乐面板载入面板列表
        this.setData({ onlineMusicPanel: { visible: false } }); //先设置不可视

        //设置界面：在page中显示自定义面板  注意避免重复
        this.setData({
            main_page: {    /* page id */
                item: [{     /* item 属性，数组 */
                    xml: 'Panels/SetPanel',       /* xml 属性，自定义面板 URL */
                    items: [                    /* items 属性，数组 */
                        /* 添加自定义面板 setPanel 到 page 中，并修改 id 为 setPanel */
                        { SetPanel: { id: "setPanel", background: 0x00FF0000, position: { x: 0, y: 0 } } },
                    ]
                }]
            }
        });
        this.setData({ setPanel: { visible: false } }); //设置为不可视
        this.loadWiFiList(); //载入wifi列表

        //设置音量进度条
        this.setData({
            main_page: {    /* page id */
                item: [{     /* item 属性，数组 */
                    xml: 'Panels/VolumePanel',  /* xml 属性，自定义面板 URL */
                    items: [                    /* items 属性，数组 */
                        /* 添加自定义面板 VolumePanel 到 page 中，并修改 id 为 panel01 */
                        { VolumePanel: { id: "volumePanel", background: 0xFF181720, position: { x: 443, y: 70 } }, hide: true },
                    ]
                }]
            }
        });
        this.setData({ volumePanel: { visible: false } }); //先设置不可视


        //设置单曲信息界面：歌词、评论区
        this.setData({
            main_page: {    /* page id */
                item: [{     /* item 属性，数组 */
                    xml: 'Panels/singlePanel',       /* xml 属性，自定义面板 URL */
                    items: [                    /* items 属性，数组 */
                        /* 添加自定义面板 singlePanel 到 page 中，并修改 id 为 singlePanel */
                        { singlePanel: { id: "singlePanel", background: 0xFFFFFFFF, position: { x: 0, y: 0 } }, hide: true },
                    ]
                }]
            }
        });
        this.loadCommentList();  //加载评论区
        this.setData({ singlePanel: { visible: false } }); //先设置不可视

        //菜单面板：在page中显示自定义面板  注意避免重复
        this.setData({
            main_page: {    /* page id */
                item: [{    /* item 属性，数组 */
                    xml: 'Panels/menuPanel',   /* xml 属性，自定义面板 URL */
                    items: [                   /* items 属性，数组 */
                        /* 添加自定义面板 menuPanel 到 page 中，并修改 id 为 menuPanel */
                        { menuPanel: { id: "menuPanel", position: { x: 0, y: 0 } } },
                    ]
                }]
            }
        });
        this.setData({ menuPanel: { visible: false } }); //设置不可视

        //WiFi面板：在page中显示自定义面板  注意避免重复
        this.setData({
            main_page: {    /* page id */
                item: [{    /* item 属性，数组 */
                    xml: 'Panels/wifiPassWordPanel',   /* xml 属性，自定义面板 URL */
                    items: [                   /* items 属性，数组 */
                        /* 添加自定义面板 wifiPassWordPanel 到 page 中，并修改 id 为 wifiPassWordPanel */
                        { wifiPassWordPanel: { id: "wifiPassWordPanel", position: { x: 0, y: 0 } } },
                    ]
                }]
            }
        });
        this.setData({ wifiPassWordPanel: { visible: false } }); //设置不可视
    },


    //设置切换菜单时的显示
    CIbindchang: function (event) {
        //修改标题.
        console.log(event.detail.value)
        switch (event.detail.value) {   //该控件存在问题，设置的名称和图片对不上
            case "localMusic":
                this.setData({ settingLabel: { value: "设置" } });
                break;
            case "onlineMusic":
                this.setData({ settingLabel: { value: "个性推荐" } });
                break;
            case "recommend":
                this.setData({ settingLabel: { value: "在线音乐" } });
                break;
            case "setting":
                this.setData({ settingLabel: { value: "本地音乐" } });
                break;
            default:
                break;
        }
    },
}
Page(page);
page = 0;
