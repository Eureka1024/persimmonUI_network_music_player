
var audio = 0;  //音频播放器
var wifi = 0;   //wifi

/***************当前播放歌曲信息*****************/
var currentSongInfo = {
    source: "localSources", //歌曲来源（区分音频来源是本地或网络）
    id: 167850,             //用于搜索网络歌曲的id，相当于网络音乐路径
    src: "/mnt/sd0/music/lzy.mp3",  //用于获取音乐路径
    name: '庐州月',         //歌曲名称
    singer: "许嵩",            //作者
    num: 0                  //歌曲在播放列表中的位置
};

/***************Local Music List*****************/
//本地音乐的播放列表
var LocalMusicArray = [
    { name: "庐州月-许嵩", src: "/mnt/sd0/music/lzy.mp3" , length : 255},
    { name: "Victory-Two Steps From Hell", src: "/mnt/sd0/music/Victory-Two Steps From Hell.mp3" , length : 320},
    { name: "The Mass-Era", src: "/mnt/sd0/music/The Mass-Era.mp3" , length : 223},
    { name: "数码宝贝主题曲", src: "/mnt/sd0/music/brave_heart.mp3" , length : 252 },
    { name: "权利的游戏主题曲", src: "/mnt/sd0/music/The Learning Version.mp3", length : 105 },
    { name: "好久不见-陈奕迅", src: "/mnt/sd0/music/hjbj.mp3" , length : 252},
    { name: "你曾是少年-S.H.E", src: "/mnt/sd0/music/ncssn.mp3" , length : 266}
];

/***************Online Music List*****************/
//网络音乐的播放列表 
var OnlineMusicArray = [
    { name: "未知", id: "", singer: "未知", length : 1 },
    { name: "未知", id: "", singer: "未知", length : 1 },
    { name: "未知", id: "", singer: "未知", length : 1 },
    { name: "未知", id: "", singer: "未知", length : 1},
    { name: "未知", id: "", singer: "未知", length : 1 },
];


var app = {
    page: "main_page/main_page",

    /* app 加载完成触发该函数 */
    onLaunch: function () {

    },

    /* app 退出触发该函数 */
    onExit: function () {

    },

};

App(app);

app = 0;
