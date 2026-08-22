export const BulletData = {
    "hana_a01" : {
        key: "hana_a01", 
        w: 32,  h: 32,  scale: 1, radius: 10,
        speed: 300, delay: 0.5,
        power: 10, hp: 10,
        rotation: 60,
        hitSe: 'hit01',
        skill: 'multiShoot',
    },

    "ningyo_a01" : {
        key: "ningyo_a01", 
        w: 32,  h: 32,  scale: 1, radius: 10,
        speed: 300, delay: 0.5,
        power: 10, hp: 10,
        rotation: 60,
        hitSe: 'hit01',
        skill: 'bigShoot',
    },

    "tensi_a01" : {
        key: "tensi_a01", 
        w: 32,  h: 32,  scale: 1, radius: 10,
        speed: 300, delay: 0.5,
        power: 10, hp: 10,
        rotation: 60,
        hitSe: 'hit01',
        skill: 'wideShoot',
    },

    // 動物スキル
    "ninjinDrill" : {
        key: "ninjin",
        isPetSkill: true,
        w: 128, h: 128, scale:1.5, radius: 32,
        baseAngle: -80,
        hitSe: "hit01",
        power: 40, hp: 10000,
        offset: [80, 0],
        update: false,
        hitNum: 1,
    },

    "omusubiKororin" : {
        key: "dummy",
        isPetSkill: true,
        w: 1, h: 1, scale: 1, radius: 48,
        rotation: 600,
        hitSe: "hit01",
        power: 40, hp: 10000,
        hitNum: 1,
        moveType: "chaseUser",
    },

    "nezumiFever" : {
        key: "cheese",
        w: 128, h: 128, scale: 0.5, radius: 32,
        power: 0, hp: 10000,
        speed: 200,
        update: false,
        hitAction: "hit_NezumiFever", 
    },

    "nezumiFever_nezu" : {
        key: "pet_nezumi",
        w: 64, h: 64, scale: 0.5, radius: 32,
        power: 6, hp: 10000,
        speed: 400,
        update: false,
        hitNum: 1,
    },

    "donguriMeteor" : {
        key: "donguri",
        w: 128, h: 128, scale: 0.5, radius: 32,
        baseAngle: -55,
        hitSe: "hit01",
        power: 0, hp: 1,
        update: false,
        deadCreate: "donguriExp",
    },

    "donguriExp" : {
        key: "explosion",
        isPetSkill: true,
        type: "sprite",
        w: 64, h: 64, scale: 2, radius: 28,
        power: 20, hp: 10000,
        speed: 0, 
        frame: 23,
        useSe: 'explosion01',
        options: {frameWidth: 64, frameHeight: 64, endFrame: 23},
        config: {key: "explosion", frames: "explosion", frameRate: 30},
        play: {key: "explosion"},
        disappear: 23 * 30,
        hitNum: 1,
    },



    "rousokuFire" : {
        key: "fire",
        w: 64, h: 64, scale: 1, radius: 32,
        speed: 160,
        alpha: 0.75,
        power: 30, hp: 10000,
        hitSe: "hit01",
        update: false,
        hitNum: 1,
    },

    "sasaCutter" : {
        key: "sasanoha",
        w: 16, h: 40, scale: 1, radius: 10,
        speed: 360,
        power: 6, hp: 6,
        offset: [24, 0],
        hitSe: "hit01",
        update: false,
    },

    "ufo_light" : {
        key: "uzako04_light",
        w: 128, h: 128, scale: 1,
        collideType: "rect",
        collideSize: [48,48],
        power: 15, hp: 15,
        moveType: "ufoLightMove",
        huttobi: true,
    },

    "moon_wind1" : {
        key: "moon_wind1",
        w: 96, h: 96, scale: 1,
        collideType: "rect",
        collideSize: [64,64],
        power: 15, hp: 15,
        moveType: "moon_wind1Move",
        huttobi: true,
    },

    "moon_wind2" : {
        key: "moon_wind2",
        w: 96, h: 96, scale: 1,
        collideType: "rect",
        collideSize: [64,64],
        power: 15, hp: 15,
        moveType: "moon_wind2Move",
        huttobi: true,
    },


    "hakase_a01" : {
        key: "enemy002",
        w: 64, h: 64, scale: 0.5, radius: 18,
        speed: 250, delay: 2,
        power: 15, hp: 20,
        hitSe: 'hit01',
        petSkillRate: 100,
    },

    "pikakuma_a01" : {
        key: "pika_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 250, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "pikakuma_kumo" : {
        key: "pika_kumo",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 100, delay: 2,
        power: 15, hp: 50,
        hitSe: 'hit01',
        y: 24,
        collideType: "rect",
        collideSize: [56,28],
        moveType: "pikakumoMove",
        huttobi: true,
        hasCoin: 10,
        petSkillRate: 100,
    },

    "pikakuma_kumo2" : {
        key: "pika_kumo",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 100, delay: 2,
        power: 15, hp: 50,
        hitSe: 'hit01',
        y: 480 - 24,
        collideType: "rect",
        collideSize: [56,28],
        moveType: "pikakumo2Move",
        huttobi: true,
        hasCoin: 10,
        petSkillRate: 100,
    },

    "pikakumo_atk" : {
        key: "pika_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 180, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        petSkillRate: 100,
    },

    "musibaikin_a01" : {
        key: "musiba_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 250, delay: 2,
        power: 15, hp: 80,
        hitSe: 'hit01',
        petSkillRate: 100,
    },

    "baikin_hole" : {
        key: "blackhole",
        w: 64, h: 64, scale: 1, hitress: true,
        speed: 0, delay: 2,
        power: 0, hp: 1000,
        moveType: "baikinHoleMove",
        rotation: -60, alpha: 0.75,
    },

    "baikin_s" : {
        key: "baikin_s",
        w: 48, h: 48, scale: 1, radius: 16,
        speed: 160,
        power: 15, hp: 30,
        moveType: "initChasePlayer",
        huttobi: true,
        hasCoin: 1,
        petSkillRate: 100,
    },

    "baikin_hole2" : {
        key: "blackhole",
        w: 64, h: 64, scale: 1,
        speed: 0, delay: 2,
        power: 50, hp: 80,
        moveType: "baikinHole2Move",
        rotation: -60, alpha: 0.75,
        huttobi: true,
        hasCoin: 50,
    },

    "miminzuku_a01" : {
        key: "mimi_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 250, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "miminzuku_a02" : {
        key: "mimi_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 100, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "miminzuku_warp" : {
        key: "blackhole_b",
        w: 128, h: 128, scale: 1.5, hitress: true,
        speed: 0, delay: 2,
        power: 0, hp: 1000,
        moveType: "miminzukuWarp",
        rotation: -60, alpha: 0.9,
        invalidShootPosition: true,
    },

    "zombie_a01" : {
        key: "zombie_a01",
        w: 32, h: 32, scale: 1, radius: 10,
        speed: 250, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "majo1_a01" : {
        key: "majo1_a01",
        w: 48, h: 48, scale: 1, radius: 16,
        speed: 220, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "majo1_hole" : {
        key: "blackhole",
        w: 64, h: 64, scale: 1,
        speed: -90, delay: 2,
        power: 20, hp: 200,
        timeline: "majo1HoleTimeline",
        rotation: -60, alpha: 0.75,
    },

    "majo2_a01" : {
        key: "majo2_a01",
        w: 48, h: 48, scale: 1, radius: 20,
        speed: 160, delay: 2,
        power: 15, hp: 60,
        hitSe: 'hit01',
        baseAngle: 90,
        timeline: "majo2A01Timeline",
        syncAngleWithVelocity: true,
        petSkillRate: 100,
    },

    "explosion" : {
        key: "explosion",
        type: "sprite",
        w: 64, h: 64, scale: 3, radius: 28,
        power: 10, hp: 100,
        speed: 0, 
        frame: 23,
        useSe: 'explosion01',
        options: {frameWidth: 64, frameHeight: 64, endFrame: 23},
        config: {key: "explosion", frames: "explosion", frameRate: 30},
        play: {key: "explosion"},
        disappear: 23 * 30,
    },

    "magic_explosion" : {
        key: "magic",
        w: 64, h: 64, scale: 1, hitress: true,
        speed: 0, delay: 2,
        power: 0, hp: 1000,
        update: false,
        timeline: "magicExplosionTimeline",
        rotation: -60, alpha: 0.75,
    },


    "angry" : {
        key: "angry",
        w: 64, h: 64, scale: 1, hitress: true,
        speed: 0, delay: 2,
        power: 0, hp: 1000,
        offset: [24, -64],
        update: false,
        timeline: "draw_2000ms",
    },
};

export const CharacterData = {
    //#region プレイヤー
    "hana" : {
        key: "hana", 
        name: "フロル",
        info: "花の妖精さん。\nお父さんはひまわり、お母さんはチューリップ。",
        w: 96,  h: 96,  scale: 1, radius: 18,
        speed: 225,
        power: 50, hp: 20,
        bullets: ["hana_a01"],
    },

    "ningyo" : {
        key: "ningyo", 
        name: "マリン",
        info: "海の妖精さん。\nお父さんとお母さんは波の泡。",
        w: 96,  h: 96,  scale: 1, radius: 18,
        speed: 225,
        power: 50, hp: 20,
        bullets: ["ningyo_a01"],
    },

    "tensi" : {
        key: "tensi", 
        name: "キラリ",
        info: "流れ星の妖精さん。\nお父さんとお母さんは星の輝き。",
        w: 96,  h: 96,  scale: 1, radius: 18,
        speed: 225,
        power: 50, hp: 20,
        bullets: ["tensi_a01"],
    },
    //#endregion

    //#region 空
    "zako1" : {
        key: "enemy002", 
        name: "菌(きん)",
        info: "ノーズ・カタギリが作り出したバイ菌。\n繁殖力がヤバい。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 10, hp: 10,
        hasCoin: 1,
    },

    "zako2" : {
        key: "enemy001", 
        name: "鬼菌(おにきん)",
        info: "ノーズ・カタギリが作り出したバイ菌。\n繁殖力が強くしぶとい。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 30, hp: 30,
        hasCoin: 10,
        item: "rand",
    },

    "kuma" : {
        key: "kuma", 
        name: "くまあざらし",
        info: "足は短いのに走るのはとても速い。",
        w: 64,  h: 64,  scale: 1, radius: 18,
        speed: 10,
        power: 30, hp: 30,
        moveType: "accelX",
        hasCoin: 20,
        item: "skill",
    },
    //#endregion

    //#region 海
    "tako1" : {
        key: "tako", 
        name: "たこ",
        info: "おとなしい性格。\n群れで行動する事が多い。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 10, hp: 10,
        hasCoin: 1,
    },

    "tako2" : {
        key: "tako", 
        name: "ゆでだこ",
        info: "茹でられたように赤いが、\n茹でられてはいない。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 30, hp: 30,
        tint: 0xffaaaa,
        hasCoin: 10,
        item: "rand",
    },

    "ika" : {
        key: "ika", 
        name: "いか",
        info: "自由気ままに泳ぐのが好き。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 100,
        power: 20, hp: 30,
        hasCoin: 1,
        moveType: "ikaMove",
        item: "rapid",
    },

    "wani" : {
        key: "wani", 
        name: "ワニ",
        info: "海のハンター。\n近づくととっても危険。",
        figureY: 38,
        w: 128,  h: 128,  scale: 1, radius: 36,
        speed: 240,
        power: 50, hp: 40,
        moveType: "waniMove",
        moveParams: {min:150, max:210, add:1},
        hasCoin: 30,
        item: "skill",
    },
    //#endregion

    //#region 宇宙
    "uzako01" : {
        key: "uzako01", 
        name: "宇宙人(うちゅうじん)",
        info: "よそ者には冷たいタイプ。\n怒りっぽい。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 10, hp: 10,
        hasCoin: 1,
    },

    "uzako02" : {
        key: "uzako02", 
        name: "スーパー宇宙人(うちゅうじん)",
        info: "宇宙人のリーダー格。\n怒りっぽい。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 30, hp: 30,
        tint: 0xffaaaa,
        hasCoin: 10,
        item: "rand",
    },

    "uzako03" : {
        key: "uzako03", 
        name: "グレイ",
        info: "故郷を探している。\n実はいい奴という噂も。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 100,
        power: 20, hp: 30,
        hasCoin: 1,
        moveType: "ikaMove",
        item: "rapid",
    },

    "uzako04" : {
        key: "uzako04", 
        name: "ＵＦＯ(ゆーふぉー)",
        info: "誰が乗っているかは謎。",
        w: 128,  h: 128,  scale: 1, radius: 36,
        speed: 180,
        power: 50, hp: 50,
        moveType: "ufoMove",
        moveParams: {min:130, max:230, add:1},
        hasCoin: 30,
        item: "skill",
        bullets: ["ufo_light"],
    },
    //#endregion

    //#region 森
    "kinoko" : {
        key: "kinoko", 
        name: "きのこ",
        info: "毒を持っている。\n食べると危険。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 10, hp: 10,
        hasCoin: 1,
    },

    "kinoko2" : {
        key: "kinoko2", 
        name: "みどりきのこ",
        info: "強い毒を持っている。\n食べると終わる。",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 150,
        power: 30, hp: 30,
        hasCoin: 10,
        item: "rand",
    },

    "kumo" : {
        key: "kumo", 
        name: "くも",
        info: "ともだちになってくれるくもを探している。",
        w: 80,  h: 80,  scale: 1, radius: 24,
        speed: 60,
        power: 20, hp: 20,
        hasCoin: 20,
        moveType: "kumoMove",
        children: ["kumo_ito"],
        item: "rand",
    },

    "kumokumo" : {
        key: "kumokumo", 
        name: "くもくも",
        info: "ともだちを見つけたくも。\nとてもなかよし。",
        w: 160,  h: 160,  scale: 1,
        origin: [0.5, 0.3],
        speed: 60,
        power: 30, hp: 60,
        hasCoin: 40,
        moveType: "kumokumoMove",
        children: ["kumo_ito"],
        collideType: "rect",
        collideSize: [80, 120],
        item: "skill",
    },

    "kumo_ito" : {
        key: "kumo_ito", 
        name: "くもいと",
        w: 1,  h: 29,  scaleY: 20,
        origin: [0.5, 1],
        speed: 60,
        power: 20, hp: 50,
        hasCoin: 10,
        moveType: "chaseParent",
        collideType: "rect",
        collideSize: [4,29],
        offset: [0, -12],
        item: "rand",
    },
    //#endregion

    //#region 洞窟
    "rock" : {
        key: "rock", 
        name: "とうせんぼいわ",
        info: "",
        figureScale: 0.3,
        w: 480,  h: 480,  scale: 1,
        collideType: "rect",
        collideSize: [32,360],
        speed: 100,
        power: 200, hp: 2000,
        petSkillRate: 100,
        hasCoin: 1,
    },

    "rock_u" : {
        key: "rock", 
        w: 480,  h: 480,  scale: 1,
        collideType: "rect",
        collideSize: [32,360],
        speed: 100,
        power: 200, hp: 2000,
        petSkillRate: 100,
        baseAngle: 180,
        hasCoin: 1,
        removeGacha: true,
    },

    "bat" : {
        key: "bat", 
        name: "こうもり",
        info: "",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 240,
        power: 20, hp: 10,
        moveType: "waniMove",
        moveParams: {min:160, max:200, add:1},
        hasCoin: 1,
    },

    "dossun" : {
        key: "dossun", 
        name: "ドッスン",
        info: "",
        w: 96,  h: 96,  scale: 1,
        speed: 160,
        power: 40, hp: 50,
        hasCoin: 1,

        moveType: "dossunMove",
        moveParams: {up:30, down:420},
        collideType: "rect",
        collideSize: [80, 80],
        item: "rand",
    },
    //#endregion

    //#region ホラー
    "obake_wanko" : {
        key: "obake_wanko", 
        name: "おばけわんこ",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 160,
        power: 10, hp: 10,
        moveType: "obakeMove",
        moveParams: {min:160, max:200, add:1},
        hasCoin: 2,
    },

    "obake_neko" : {
        key: "obake_neko", 
        name: "おばけねこ",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 160,
        power: 20, hp: 20,
        moveType: "obakeMove",
        moveParams: {min:160, max:200, add:1},
        hasCoin: 3,
    },

    "obake_bousi" : {
        key: "obake_bousi", 
        name: "おばけぼうしわんこ",
        w: 64,  h: 64,  scale: 1, radius: 24,
        speed: 160,
        power: 30, hp: 40,
        moveType: "obakeMove_UTurn",
        moveParams: {min:160, max:200, add:1},
        hasCoin: 20,
        item: "rand",
    },
    //#endregion

    //#region 魔女の森
    "moon1" : {
        key: "moon1", 
        name: "月・長男",
        w: 96,  h: 96,  scale: 1, radius: 36,
        speed: 100,
        power: 20, hp: 40,
        timeline: "moon1Timeline",
        bullets: ["moon_wind1","moon_wind2"],
        children: ["moon2", "moon3"],
        hasCoin: 10,
    },

    "moon2" : {
        key: "moon2", 
        name: "月・次男",
        w: 96,  h: 96,  scale: 1, radius: 36,
        speed: 100,
        power: 20, hp: 40,
        moveType: "moon2Move",
        timeline: "moonTimeline",
        offset: [-120, 0],
        moveParams: [-120, -168],
        hasCoin: 5,
    },

    "moon3" : {
        key: "moon3", 
        name: "月・末っ子",
        w: 96,  h: 96,  scale: 1, radius: 28,
        speed: 100,
        power: 20, hp: 30,
        moveType: "moon3Move",
        timeline: "moonTimeline",
        offset: [120, 0],
        moveParams: [120, 168],
        hasCoin: 15,
        item: "skill",
    },

    "mkinoko_body" : {
        key: "mkinoko_body", 
        name: "みつあみキノコ（みつあみ爆発）",
        w: 64,  h: 64,  scale: 1, radius: 28,
        speed: 130,
        power: 20, hp: 60,
        children: ["mkinoko_hair"],
        hasCoin: 10,
        item: "rand",
    },

    "mkinoko_hair" : {
        key: "mkinoko_hair", 
        name: "キノコのみつあみ",
        w: 48,  h: 89,  scale: 1, radius: 32,
        speed: 130,
        power: 20, hp: 100,
        collideType: "rect",
        collideSize: [48,90],
        origin: [0.2, 0.1],
        moveType: "chaseParent",
        timeline: "mkinokoHairTimeline",
        bullets: ["explosion"],
        offset: [18, 16],
        hasCoin: 20,
    },

    "mkuma" : {
        key: "mkuma", 
        name: "くま",
        w: 160,  h: 160,  scale: 1, radius: 68,
        speed: 200,
        power: 30, hp: 80,
        update: false,
        timeline: "mkumaTimeline",
        hasCoin: 20,
    },



    //#endregion

    //#region ボス
    "hakase" : {
        key: "hakase_body",
        name: "はながとれたノーズ・カタギリ",
        info: "バイ菌をこよなく愛する\nマッドサイエンティスト。",
        figureY: -4,
        w: 128, h:128, scale:1,
        speed: 120,
        power: 200, hp: 200,

        collideType: "rect",
        collideSize: [56,100],
        //moveType: "hakaseMove",
        update: false,
        timeline: "hakaseTimeline",
        bullets: ["hakase_a01"],
        children: ["hakase_nose"],
        hasCoin: 100,
        petSkillRate: 0.5,
    },

    "hakase_nose" : {
        key: "hakase_nose",
        name: "ノーズ・カタギリのはな",
        w:28, h:13, scale:1,
        speed: 120,
        power: 50, hp: 50,
        moveType: "chaseParent",
        collideType: "rect",
        collideSize: [28,13],
        offset: [-23,-25],
        hasCoin: 100,
        petSkillRate: 0.5,
    },


    "pikakuma" : {
        key: "pikakuma",
        name: "ビリビリねこちゃん",
        info: "頭の帽子から色んな方向に\nビリビリ電気を出す。",
        figureY: -8,
        w: 128, h: 128, scale: 1,
        speed: 200,
        power: 100, hp: 400,
        //moveType: "pikakumaMove",
        update: false,
        timeline: "pikakumaTimeline",
        collideType: "rect",
        collideSize: [56,100],
        bullets: ["pikakuma_a01", "pikakuma_kumo"],
        hasCoin: 200,
        petSkillRate: 0.5,
    },

    "musibaikin" : {
        key: "musibaikin",
        name: "むしばいきんちゃん",
        figureY: -8,
        w: 128, h: 128, scale: 1,
        speed: 120,
        power: 300, hp: 300,
        //moveType: "musibaikinMove",
        update: false,
        timeline: "musibaikinTimeline",
        collideType: "rect",
        collideSize: [56,100],
        bullets: ["musibaikin_a01", "baikin_hole", "baikin_s"],
        hasCoin: 200,
        petSkillRate: 0.5,
    },

    "musibaikin2" : {
        key: "musibaikin",
        w: 128, h: 128, scale: 1,
        speed: 120,
        power: 20, hp: 300,
        moveType: "musibaikin2Move",
        collideType: "rect",
        collideSize: [56,100],
        bullets: ["musibaikin_a01", "baikin_hole", "baikin_s"],
        hasCoin: 100,
        removeGacha: true,
        petSkillRate: 0.5,
    },

    "miminzuku" : {
        key: "miminzuku",
        name: "ミミンズク",
        info: "森の長老。\n魔法が使える偏屈じいさん。",
        figureY: -8,
        w: 128, h: 128, scale:1,
        speed: 120,
        power: 400, hp: 400,
        update: false,
        timeline: "miminzukuTimeline",
        collideType: "rect",
        collideSize: [56,112],
        bullets: ["miminzuku_a01", "miminzuku_a02", "miminzuku_warp"],
        hasCoin: 200,
        shootPosition: [-32, -44],
        petSkillRate: 0.5,
    },

    "gorori" : {
        key: "gorori",
        name: "ゴロリ",
        info: "",
        figureY: -8,
        w: 128, h: 128, scale:1,
        speed: 160,
        power: 30, hp: 400,
        radius: 48,

        servants: ["bat"],
        update: false,
        timeline: "gororiTimeline",
        hasCoin: 200,
        petSkillRate: 0.5,
    },

    "zombie_body" : {
        key: "zombie_body",
        name: "ゾンビボディ",
        info: "",
        figureY: -8,
        w: 128, h: 128, scale: 1,
        speed: 200,
        power: 100, hp: 200,
        update: false,
        timeline: "hakaseTimeline",
        collideType: "rect",
        collideOffset: [4, 18],
        collideSize: [45,78],
        bullets: ["zombie_a01"],
        children: ["zombie_head"],
        isDeadRemoveChild: true,
        hasCoin: 120,

        removeGacha: true,
        petSkillRate: 0.5,
    },

    "zombie_head" : {
        key: "zombie_head",
        name: "ゾンビヘッド",
        info: "",
        figureY: -8,
        w: 45, h: 41, scale: 1,
        speed: 200,
        power: 100, hp: 200,
        moveType: "zombieHeadMove",
        collideType: "rect",
        collideSize: [45,41],
        offset: [4,-40],
        bullets: ["zombie_a01"],
        hasCoin: 120,

        removeGacha: true,
        petSkillRate: 0.5,
    },

    "majo1" : {
        key: "majo1",
        name: "魔女（姉）",
        info: "",
        figureY: -8,
        w: 160, h: 160, scale: 1,
        speed: 200,
        power: 100, hp: 400,
        //moveType: "pikakumaMove",
        update: false,
        timeline: "majo1Timeline",
        collideType: "rect",
        collideSize: [70,140],
        bullets: ["majo1_a01", "majo1_hole", "magic_explosion", "explosion"],
        hasCoin: 100,
        petSkillRate: 0.5,
    },

    "majo2_body" : {
        key: "majo2_body",
        name: "帽子を取られた魔女（妹）",
        info: "",
        figureY: -8,
        w: 160, h: 160, scale: 1,
        speed: 200,
        power: 100, hp: 400,
        update: false,
        timeline: "majo2Timeline",
        collideType: "rect",
        collideSize: [70,90],
        collideOffset: [0, 14],
        children: ["majo2_hat", "majo2_pet"],
        bullets: ["majo2_a01", "pikakuma_kumo", "pikakuma_kumo2", "magic_explosion", "explosion", "pikakuma_a01", "angry"],
        hasCoin: 100,
        petSkillRate: 0.5,
    },

    "majo2_hat" : {
        key: "majo2_hat",
        name: "魔女（妹）の帽子",
        w:56, h:27, scale:1,
        speed: 200,
        power: 50, hp: 50,
        update: false,
        timeline: "majo2Timeline",
        collideType: "rect",
        collideSize: [80,24],
        offset: [-4,-34],
        hasCoin: 100,
        petSkillRate: 0.5,
    },

    "majo2_pet" : {
        key: "majo2_pet",
        name: "魔女（妹）のペット",
        w:96, h:96, scale:1, radius: 32,
        speed: 160,
        power: 30, hp: 120,
        update: false,
        timeline: "majo2Timeline",
        hasCoin: 50,
        offset: [90,120],
        petSkillRate: 0.5,
    },

    //#endregion

    //#region フィギュア用
    // 動物
    "usagi01" : {
        key: "icon_usagi01",
        name: "うさぎ（あかちゃん）",
        info: "ちょっとなまいき。\nにんじんが好き。",
        figureY: 18,
    },

    "usagi02" : {
        key: "icon_usagi02",
        name: "うさぎ",
        info: "ちょっとなまいき。\nにんじんが好き。",
    },

    "hamu01" : {
        key: "icon_hamu01",
        name: "おにはむ（あかちゃん）",
        info: "おにぎりみたいなハムスター。\nおにぎりが好き。",
        figureY: 32,
    },

    "hamu02" : {
        key: "icon_hamu02",
        name: "おにはむ",
        info: "おにぎりみたいなハムスター。\nおにぎりが好き。",
    },

    "nezumi01" : {
        key: "icon_nezumi01",
        name: "ねじゅみ（あかちゃん）",
        info: "したったらずなねずみ。\nチーズが好き。",
        figureY: 32,
    },

    "nezumi02" : {
        key: "icon_nezumi02",
        name: "ねじゅみ",
        info: "ちょっとなまいき。\nにんじんが好き。",
    },

    "risu01" : {
        key: "icon_risu01",
        name: "りす（あかちゃん）",
        info: "ちょっと泣き虫。\nどんぐりが好き。",
        figureY: 32,
    },

    "risu02" : {
        key: "icon_risu02",
        name: "りす",
        info: "ちょっと泣き虫。\nどんぐりが好き。",
    },

    "puyorisu01" : {
        key: "icon_puyorisu01",
        name: "ぷよりす（あかちゃん）",
        info: "",
        figureY: 8,
    },

    "puyorisu02" : {
        key: "icon_puyorisu02",
        name: "ぷよりす",
        info: "",
    },

    "panda01" : {
        key: "icon_panda01",
        name: "パンダ（あかちゃん）",
        info: "",
        figureY: 8,
    },

    "panda02" : {
        key: "icon_panda02",
        name: "パンダ",
        info: "",
    },



    // かご
    "kago_usagi" : {
        key: "kago_usagi",
        name: "とらわれうさぎ",
    },

    "kago_hamu" : {
        key: "kago_hamu",
        name: "とらわれおにはむ",
    },

    "kago_nezumi" : {
        key: "kago_nezumi",
        name: "とらわれねじゅみ",
    },

    "kago_risu" : {
        key: "kago_risu",
        name: "とらわれりす",
    },

    "kago_puyorisu" : {
        key: "kago_puyorisu",
        name: "とらわれぷよりす",
    },

    "kago_panda" : {
        key: "kago_panda",
        name: "とらわれパンダ",
    },

    // えさ
    "ninjin" : {
        key: "ninjin",
        name: "にんじん",
    },

    "onigiri" : {
        key: "onigiri",
        name: "おにぎり",
    },

    "cheese" : {
        key: "cheese",
        name: "チーズ",
    },

    "donguri" : {
        key: "donguri",
        name: "どんぐり",
    },

    "mikan" : {
        key: "mikan",
        name: "みかん",
    },

    "sasa" : {
        key: "sasa",
        name: "笹の葉",
    },

    // 敵
    "mkinoko" : {
        key: "mkinoko",
        name: "みつあみキノコ",
    },

    "moons" : {
        key: "moons",
        name: "つき３きょうだい",
    },

    "baikin" : {
        key: "baikin",
        name: "デビルくまあざらし",
        info: "いたずらが大好き。\n痛いところをついてくる。",
    },

    "baikin_hole" : {
        key: "blackhole",
        name: "ブラックホール",
    },

    "pikakuma_kumo" : {
        key: "pika_kumo",
        name: "かみなりぐも",
    },

    "hakase_n" : {
        key: "hakase",
        name: "ノーズ・カタギリ",
        figureY: -4,
    },

    "zombie" : {
        key: "zombie",
        name: "ゾンビ",
        figureY: -4,
    },

    "majo2" : {
        key: "majo2",
        name: "魔女（妹）",
        figureY: -4,
    },


    //#endregion
};

export const StageData = {
    "hakase" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                ["zako1", 180, 0],["zako1", 180, 0.5],["zako1", 180, 1],["zako2", 180, 1.5],
                ["zako1", 240, 5],["zako1", 240, 5.5],["zako1", 240, 6],["zako2", 240, 6.5],
                ["zako1", 120, 10],["zako1", 180, 10.5],["zako1", 240, 11],["zako1", 320, 11.5],["zako2", 400, 12],
                ["zako1", 380, 15],["zako1", 100, 15.5],["zako1", 240, 16],["zako1", 160, 16.5],["zako2", 300, 17],
                ["kuma", 160, 18.5],["zako1", 200, 19],["zako2", 100, 19.5],["kuma", 300, 20],["kuma", 360, 20.5],
                ["hakase", 240, 24, {popActions: ["stopTimer"], children: [["hakase_nose"]]}],
            ],
        },
        stageImage: "hakase",
        animal: "usagi",
        backImage: "back01",
        bgm: "myhome",
        clearTime: 28,
    },

    "pikakuma" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                ["tako1", 180, 0],["tako1", 180, 0.5],["tako1", 180, 1],["tako1", 180, 1.5],["tako2", 180, 2],
                ["tako1", 240, 5],["tako1", 240, 5.5],["tako1", 240, 6],["tako1", 240, 6.5],["tako2", 240, 7],
                ["tako1", 120, 10],["tako1", 180, 10.5],["tako1", 240, 11],["ika", 320, 11.5],["tako2", 400, 12],
                ["tako1", 380, 15],["tako1", 100, 15.5],["tako1", 240, 16],["ika", 160, 16.5],["tako1", 300, 17],
                ["wani", 160, 17.5],
                ["ika", 160, 18.5],["tako1", 200, 19],["tako1", 100, 19.5],["ika", 300, 20],["ika", 360, 20.5],
                ["wani", 360, 19],["wani", 80, 21],["wani", 320, 23],
                ["pikakuma", 240, 24, {popActions: ["stopTimer"]}],
            ],
        },
        stageImage: "pikakuma",
        animal: "hamu",
        backImage: "back02",
        bgm: "myhome",
        clearTime: 28,
    },

    "musibaikin" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                ["uzako01", 180, 0],["uzako01", 180, 0.5],["uzako01", 180, 1],["uzako02", 180, 1.5],
                ["uzako01", 240, 2.5],["uzako01", 240, 3],["uzako01", 240, 3.5],["uzako02", 240, 4],
                ["uzako01", 320, 5],["uzako01", 320, 5.5],["uzako01", 320, 6],["uzako02", 320, 6.5],
                ["uzako01", 120, 7],["uzako01", 180, 7.5],["uzako02", 240, 8],["uzako01", 320, 8.5],["uzako03", 260, 7.5],
                ["uzako02", 380, 8],["uzako01", 280, 8.5],["uzako01", 180, 9],["uzako02", 80, 9.5],["uzako03", 320, 9],
                ["uzako01", 120, 12],["uzako01", 180, 12],["uzako02", 240, 12],["uzako01", 300, 12],["uzako01", 360, 12],["uzako01", 420, 12],
                ["uzako02", 90, 13],["uzako01", 150, 13],["uzako01", 210, 13],["uzako01", 270, 13],["uzako01", 330, 13],["uzako02", 390, 13],["uzako01", 450, 13],
                ["uzako01", 380, 15],["uzako01", 100, 15.5],["uzako01", 240, 16],["uzako03", 160, 16.5],["uzako01", 300, 17],
                ["uzako04", 160, 17.5],
                ["uzako03", 160, 18.5],["uzako01", 200, 19],["uzako01", 100, 19.5],["uzako03", 300, 20],["uzako03", 360, 20.5],
                ["uzako04", 360, 19],["uzako04", 80, 21],["uzako04", 320, 23],
                ["musibaikin", 240, 24, {popActions: ["stopTimer"]}],
            ],
        },
        stageImage: "musibaikin",
        animal: "nezumi",
        backImage: "back03",
        bgm: "myhome",
        clearTime: 28,
    },

    "miminzuku" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                ["kinoko", 220, 0],["kinoko", 190, 0.5],["kinoko", 160, 1],["kinoko", 130, 1.5],["kinoko2", 100, 2],
                ["kinoko", 250, 0],["kinoko", 290, 0.5],["kinoko", 320, 1],["kinoko", 350, 1.5],["kinoko2", 380, 2],
                ["kumo", -80, 4, {children:[["kumo_ito"]], params:[600,240]}],["kumo", -80, 7, {children:[["kumo_ito"]], params:[400,320]}],
                ["zako1", 205, 5],["zako1", 150, 5.3],["zako1", 100, 5.7],["zako1", 100, 6.2],["zako1", 150, 6.6],["zako1", 205, 6.9],["zako2", 235, 5.95],
                ["zako1", 265, 5],["zako1", 320, 5.3],["zako1", 370, 5.7],["zako1", 370, 6.2],["zako1", 320, 6.6],["zako1", 265, 6.9],
                ["kumo", -80, 8, {children:[["kumo_ito"]], params:[400,240]}],["kumo", -80, 10, {children:[["kumo_ito"]], params:[500,360]}],
                ["kumokumo", -120, 12, {children:[["kumo_ito"]], params:[600,300, 450,100, 300,340]}],
                ["kinoko", 160, 12],["kinoko", 220, 12.5],["kinoko", 160, 13],["kinoko", 100, 12.5],["kinoko2", 160, 12.5],
                ["kinoko", 300, 14],["kinoko", 360, 14.5],["kinoko", 300, 15],["kinoko", 240, 14.5],["kinoko2", 300, 14.5],
                ["kinoko", 240, 16],["kinoko", 300, 16.5],["kinoko", 240, 17],["kinoko", 180, 16.5],["kinoko2", 240, 16.5],
                ["kumo", -80, 16, {children:[["kumo_ito"]], params:[300,400]}],["kumo", -80, 17, {children:[["kumo_ito"]], params:[400,340]}],
                ["kumo", -80, 18, {children:[["kumo_ito"]], params:[500,280]}],["kumo", -80, 19, {children:[["kumo_ito"]], params:[600,220]}],
                ["kumokumo", -120, 20, {children:[["kumo_ito"]], params:[700,140, 550,300, 300,440]}],
                ["miminzuku", 240, 24, {popActions: ["stopTimer"]}],
            ],
        },
        stageImage: "miminzuku",
        animal: "risu",
        backImage: "back04",
        bgm: "myhome",
        clearTime: 28,
    },

    "gorori" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                ["dossun", 48, 0],
                ["bat", 120, 0, {loop:[3, 0.3]}],
                ["bat", 240, 3, {loop:[3, 0.3]}],
                ["rock", 520, 5],
                ["bat", 360, 6, {loop:[3, 0.3]}],
                ["rock_u",-60, 8],
                ["bat", 360, 10, {loop:[10, 0.3, [240, 180, 60, 320, 400, 120, 200, 280, 360, 150]]}],
                ["kumo", -80, 8, {children:[["kumo_ito"]], params:[400,240]}],["kumo", -80, 10, {children:[["kumo_ito"]], params:[500,360]}],
                ["kumokumo", -120, 12, {children:[["kumo_ito"]], params:[600,300, 450,100, 300,340]}],
                ["dossun", 48, 14],
                ["bat", 360, 15, {loop:[12, 0.3, ["rand", 60, 420]]}],
                ["rock_u", 100, 17],
                ["rock", 380, 20],
                ["kumo", -80, 21, {children:[["kumo_ito"]], params:[400,240]}],
                ["bat", 360, 23, {loop:[20, 0.3, ["rand", 60, 420]]}],
                ["dossun", 48, 21], ["dossun", 48, 23], ["dossun", 48, 25],
                ["gorori", 240, 27, {popActions: ["stopTimer"]}],
            ],
        },
        stageImage: "gorori",
        animal: "puyorisu",
        backImage: "back05",
        bgm: "myhome",
        clearTime: 31,
    },

    "zombie" : {
        enemies: {
            0: [
                ["obake_wanko", 260, 0], ["obake_neko", 260, 0.3], ["obake_bousi", 260, 0.6],
                ["obake_wanko", 320, 0.8], ["obake_neko", 320, 1.1], ["obake_bousi", 320, 1.4],
                ["obake_wanko", 120, 3, {loop:[3, 0.3]}],
                ["obake_neko", 220, 5, {loop:[3, 0.3]}],
                ["obake_bousi", 360, 7, {loop:[3, 0.3]}],
                ["kumo", -80, 8, {children:[["kumo_ito"]], params:[400,240]}],["kumo", -80, 10, {children:[["kumo_ito"]], params:[500,360]}],
                ["kumokumo", -120, 12, {children:[["kumo_ito"]], params:[600,100, 450,300, 300,200]}],
                ["obake_neko", 360, 14, {loop:[8, 0.3, ["rand", 60, 420]]}],
                ["obake_bousi", 100, 20], ["obake_bousi", 200, 20], ["obake_bousi", 300, 20], ["obake_bousi", 400, 20],
                ["obake_bousi", 50, 20], ["obake_bousi", 150, 20], ["obake_bousi", 250, 20], ["obake_bousi", 350, 20],
                ["zombie_body", 240, 22, {popActions: ["stopTimer"], children:[["zombie_head", {deadActions:["changeZombieBodyTimeline"]}]]}],
            ],
        },
        stageImage: "zombie",
        animal: "panda",
        backImage: "back06",
        bgm: "horror",
        clearTime: 25,
    },

    "majo1" : {
        enemies: {
            0: [
                ["kinoko", 140, 0, {loop:[2, 0.6]}],["kinoko2", 140, 0.3, {loop:[2, 0.6]}],
                ["kinoko", 320, 2, {loop:[2, 0.6]}],["kinoko2", 320, 2.3, {loop:[2, 0.6]}],
                ["mkinoko_body", 240, 4, {children:[["mkinoko_hair", {attackDelay:4000}]]}],
                ["moon1", 200, 8, {children:[["moon2"],["moon3"]]}],
                ["kinoko", 140, 9, {loop:[3, 0.3]}],["kinoko2", 140, 9.9],
                ["kinoko", 320, 9, {loop:[3, 0.3]}],["kinoko2", 320, 9.9],
                ["mkinoko_body", 235, 9.95, {children:[["mkinoko_hair", {attackDelay:6000}]]}],
                ["mkuma", 320, 12],
                ["moon1", 120, 15, {children:[["moon2"],["moon3"]]}],
                ["moon1", 240, 15, {children:[["moon2"],["moon3"]]}],
                ["moon1", 360, 15, {children:[["moon2"],["moon3"]]}],
                ["mkinoko_body", 100, 18, {children:[["mkinoko_hair", {attackDelay:2000}]]}],
                ["mkinoko_body", 200, 18, {children:[["mkinoko_hair", {attackDelay:3000}]]}],
                ["mkinoko_body", 300, 18, {children:[["mkinoko_hair", {attackDelay:4000}]]}],
                ["mkinoko_body", 400, 18, {children:[["mkinoko_hair", {attackDelay:5000}]]}],
                ["mkuma", 360, 20], ["mkuma", 120, 21], ["mkuma", 240, 22],
                ["majo1", 240, 24, {popActions: ["stopTimer"], deadActions: ["restartTimer", "nextWave"]}],
            ],
            1: [
                ["majo2_body", 240, 2, {popActions: ["stopTimer"], deadActions:["killChildren"], children: [
                    ["majo2_hat", {deadActions:["majo2HatDead"]}],
                    ["majo2_pet", {deadActions:["majo2PetDead"]}],
                ]}],
            ],
        },
        stageImage: "majo2_pet",
        animal: "panda",
        backImage: "back07",
        bgm: "horror",
        clearTime: 28,
    },

    "bossTest" : {
        //  [eneID, y, popTime]
        enemies: {
            0: [
                //["mkuma", 160, 1],
                //["moon1", 320, 1, {children:[["moon2"],["moon3"]]}],
                //["mkinoko_body", 240, 1, {children:[["mkinoko_hair", {attackDelay:2000}]]}],
                //["hakase", 240, 1, {popActions: ["stopTimer"], children: [["hakase_nose"]]}],
                //["pikakuma", 240, 1, {popActions: ["stopTimer"], deadActions: ["restartTimer"]}],
                //["musibaikin", 240, 1, {popActions: ["stopTimer"], deadActions: ["restartTimer"]}],
                //["miminzuku", 240, 1, {popActions: ["stopTimer"], deadActions: ["restartTimer"]}],
                //["gorori", 240, 1, {popActions: ["stopTimer"], deadActions: ["restartTimer"]}],
                //["zombie_body", 240, 1, {popActions: ["stopTimer"], children:[["zombie_head", {deadActions:["changeZombieBodyTimeline"]}]]}],
                //["majo1", 240, 1, {popActions: ["stopTimer"], deadActions: ["restartTimer", "nextWave"]}],
                //["majo2_body", 240, 2, {popActions: ["stopTimer"], deadActions:["killChildren"], children: [["majo2_hat", {deadActions:["majo2HatDead"]}]]}],
                //["majo2_pet", 240, 2],
                ["majo2_body", 240, 2, {popActions: ["stopTimer"], deadActions:["killChildren"], children: [
                    ["majo2_hat", {deadActions:["majo2HatDead"]}],
                    ["majo2_pet", {deadActions:["majo2PetDead"]}],
                ]}],
            ],
        },
        stageImage: "zombie",
        animal: "risu",
        backImage: "back07",
        bgm: "horror",
        clearTime: 5,
    },
};

export const ItemData = {
    "skill" : {
        key: "item_p",
        action: "skillUp",
    },
    "rapid" : {
        key: "item_g",
        action: "rapidUp",
    },
    "pet" : {
        key: "item_b",
        action: "petSkillUp",
    },
};

export const AnimalData = {
    "usagi" : {
        "name": "うさぎ",
        "pet" : {
            key: "pet_usagi",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["ninjinDrill"],
        },
        "caught" : {
            key: "kago_usagi",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/usagi01/",
                keyHeader: "usagi01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たすけてくれて　ありがとう\n　　　　おなかすいた　にんじんちょうだい♪」"],
                    "foods" : ["「おなかすいたー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまー♪」"],
                    "dislike":["「それ、きらーい」"],
                    "suffed" :["「おなかいっぱーい」"],
                    "bath"  : ["「おふろはいりたいよー」"],
                    "goods" : ["「なでなでしてー」"],
                    "normal": [
                        ["「どうぶつなのに　みんなからパンって\n　　　　いわれる　どうぶつなーんだ？」", "「せいかいは『パンダ』だよ！」"],
                        ["「にわでさかだちしている\n　　　　どうぶつなーんだ？」","「せいかいは『わに』だよ！」"],
                        ["「さかだちすると　あたまがわるくなる\n　　　　どうぶつなーんだ？」","「せいかいは『カバ』だよ！」"],
                        ["「かもめのあたまとおしりが　くっついたら\n　　　　ちがういきものになっちゃった」","「なんのどうぶつでしょう？」","「せいかいは『かめ』だよ！」"],
                        ["「どんなにつらいときでも　つらくないという\n　　　　どうぶつなーんだ？」","「せいかいは『らくだ』だよ！」"],
                    ],
                },
                voices: {
                    "caught": "helped_usagi",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 150,
                likeFood: "ninjin",
            },
            2: {
                keyDir: "img/animals/usagi02/",
                keyHeader: "usagi02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たすけてくれて　ありがとう\n　　　　おなかすいた　にんじんちょうだい♪」"],
                    "foods" : ["「おなかすいたー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまー♪」"],
                    "dislike":["「それ、きらーい」"],
                    "suffed" :["「おなかいっぱーい」"],
                    "bath"  : ["「おふろはいりたいよー」"],
                    "goods" : ["「なでなでしてー」"],
                    "growth": ["「いっぱいおせわしてくれてありがとう\n　　　　これからはおてつだいできるよ♪」"],
                    "normal": [
                        ["「動物なのに　みんなからパンって\n　　　　いわれる　動物なーんだ？」", "「正解は『パンダ』だよ！」"],
                        ["「にわで逆立ちしている\n　　　　動物なーんだ？」","「正解は『ワニ』だよ！」"],
                        ["「逆立ちすると　頭が悪くなる\n　　　　動物なーんだ？」","「正解は『カバ』だよ！」"],
                        ["「かもめの頭とお尻が　くっついたら\n　　　　違う動物になっちゃった」","「なんの動物でしょう？」","「正解は『カメ』だよ！」"],
                        ["「どんなにつらいときでも　つらくないという\n　　　　動物なーんだ？」","「正解は『ラクダ』だよ！」"],
                    ],
                },
                voices: {
                    "caught": "helped_usagi",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 170,
                likeFood: "ninjin",
            },
        },
    },

    "hamu" : {
        "name" : "おにはむ",
        "pet" : {
            key: "pet_hamu",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["omusubiKororin"],
        },
        "caught" : {
            key: "kago_hamu",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/hamu01/",
                keyHeader: "hamu01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 32],
                talks: {
                    "caught": ["「おなかすいたので　おにぎりください」"],
                    "foods" : ["「おなかすきました…」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした♪」"],
                    "dislike":["「それはたべられません」"],
                    "suffed" :["「おなかいっぱいです」"],
                    "bath"  : ["「おふろはいりたいです」"],
                    "goods" : ["「なでなでしてくださいっ」"],
                    "normal": [["「」"]],
                },
                voices: {
                    "caught": "helped_hamu",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 100,
                likeFood: "onigiri",
            },
            2: {
                keyDir: "img/animals/hamu02/",
                keyHeader: "hamu02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 32],
                talks: {
                    "caught": ["「おなかすいたので　おにぎりください」"],
                    "foods" : ["「おなかすきました…」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした♪」"],
                    "dislike":["「それはたべられません」"],
                    "suffed" :["「おなかいっぱいです」"],
                    "bath"  : ["「おふろはいりたいです」"],
                    "goods" : ["「なでなでしてくださいっ」"],
                    "growth": ["「成長会話」"],
                    "normal": [["「」"]],
                },
                voices: {
                    "caught": "helped_hamu",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 130,
                likeFood: "onigiri",
            },
        },
    },

    "nezumi" : {
        "name": "ねじゅみ",
        "pet" : {
            key: "pet_nezumi",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["nezumiFever"],
        },
        "caught" : {
            key: "kago_nezumi",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/nezumi01/",
                keyHeader: "nezumi01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 32],
                talks: {
                    "caught": ["「たちゅかりまちた。\n　　　　　ちーじゅがたべたいでちゅ〜」"],
                    "foods" : ["「おなかちゅいたでちゅ〜」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちちょうちゃまでちちゃ♪」"],
                    "dislike":["「しょ、しょれはだめでちゅ～」"],
                    "suffed" :["「もうたべらりぇないでちゅ～」"],
                    "bath"  : ["「おふりょはいりたいでちゅ！"],
                    "goods" : ["「なでなでちてくだちゃい！」"],
                    "normal": [["「」"]],
                   
                },
                voices: {
                    //"caught": "helped_nezumi",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 120,
                likeFood: "cheese",
            },
            2: {
                keyDir: "img/animals/nezumi02/",
                keyHeader: "nezumi02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たちゅかりまちた。ちーじゅがたべたいでちゅ〜」"],
                    "foods" : ["「おなかちゅいたでちゅ〜」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちちょうちゃまでちちゃ♪」"],
                    "dislike":["「しょ、しょれはだめでちゅ～」"],
                    "suffed" :["「もうたべらりぇないでちゅ～」"],
                    "bath"  : ["「おふりょはいりたいでちゅ！"],
                    "goods" : ["「なでなでちてくだちゃい！」"],
                    "growth": ["「成長会話」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_food", "l_happy"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_normal","l_samisi"],
                    "yogore"  : ["l_normal","l_samisi", "l_yogore"],
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 140,
                likeFood: "cheese",
            },
        },
    },

    "risu" : {
        "name": "りす",
        "pet" : {
            key: "pet_risu",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["donguriMeteor"],
        },
        "caught" : {
            key: "kago_risu",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/risu01/",
                keyHeader: "risu01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 32],
                talks: {
                    "caught": ["「たすけてくれてありがとう。\n　　　おなかすいたのー。どんぐりください」"],
                    "foods" : ["「おなかすいたのー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                voices: {
                    //"caught": "helped_risu",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 150,
                likeFood: "donguri",
            },
            2: {
                keyDir: "img/animals/risu02/",
                keyHeader: "risu02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たすけてくれてありがとう。\n　　　おなかすいたのー。どんぐりください」"],
                    "foods" : ["「おなかすいたのー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "growth": ["「成長会話」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 170,
                likeFood: "donguri",
            },
        },
    },

    "puyorisu" : {
        "name": "ぷよりす",
        "pet" : {
            key: "pet_puyorisu",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["rousokuFire"],
        },
        "caught" : {
            key: "kago_puyorisu",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/puyorisu01/",
                keyHeader: "puyorisu01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たしゅけちぇくれちぇ、あいがちょ\n　　　　みかんぷよぷよ」"],
                    "foods" : ["「おなかちゅいちゃ、みかんぷよぷよ」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                voices: {
                    //"caught": "helped_risu",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 150,
                likeFood: "mikan",
            },
            2: {
                keyDir: "img/animals/puyorisu02/",
                keyHeader: "puyorisu02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たすけてくれてありがとう。\nおなかすいたのー。どんぐりください」"],
                    "foods" : ["「おなかすいたのー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "growth": ["「成長会話」"],
                    "normal": [["「ぷよぷよ」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 170,
                likeFood: "mikan",
            },
        },
    },

    "panda" : {
        "name": "パンダ",
        "pet" : {
            key: "pet_panda",
            w: 64, h: 64, scale: 1,
            speed: 200,
            bullets: ["sasaCutter"],
        },
        "caught" : {
            key: "kago_panda",
            w: 96, h: 96, scale: 1, radius: 32,
        },
        "talk" : {
            1: {
                keyDir: "img/animals/panda01/",
                keyHeader: "panda01_",
                keyReplace: {
                    caught: "hangly",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, -24],
                talks: {
                    "caught": ["「たすけてくれてありがとぱんだ\n　　　　おなかすいたから、ささのはください」"],
                    "foods" : ["「おなかすいたのー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                voices: {
                    //"caught": "helped_risu",
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 150,
                likeFood: "sasa",
            },
            2: {
                keyDir: "img/animals/panda02/",
                keyHeader: "panda02_",
                keyReplace: {
                    growth: "happy",
                    suffed: "dislike",
                },
                fileType: ".png",
                offset: [0, 0],
                talks: {
                    "caught": ["「たすけてくれてありがとう。おなかすいたのー。どんぐりください」"],
                    "foods" : ["「おなかすいたのー」"],
                    "eat"   : ["「もぐもぐ。。。」"],
                    "eatend": ["「ごちそうさまでした」"],
                    "dislike":["「それはたべられないのー」"],
                    "suffed" :["「もうたべられないのー」"],
                    "bath"  : ["「おふろはいりたいのー」"],
                    "goods" : ["「なでなでしてほしいのー」"],
                    "growth": ["「成長会話」"],
                    "normal": [["「」"]],
                },
                layers: {
                    "base" : ["base"],
                    "normal"  : ["l_normal"],
                    "dislike" : ["l_dislike"],
                    "hangly"  : ["l_hangly"],
                    "nade"    : ["l_nade"],
                    "manzoku" : ["l_nade", "l_manzoku"],
                    "food01"  : ["l_mogu"],
                    "food02"  : ["l_mogu2"],
                    "happy"   : ["l_happy"],
                    "kirei"   : ["l_kirei"],
                    "samisi"  : ["l_samisi"],
                    "yogore"  : ["l_samisi", "l_yogore"],
                },
                eatFrames: ["food01","food02","food01","food02","food01","food02","happy"],
                eatSpeed: 800,
                eatRec: 15,
                touchRadius: 170,
                likeFood: "sasa",
            },
        },
    },


};

export const DressupData = {
    "hat01"       : {key: "dress_hat01",       name: "むぎわらぼうし",           buttonScale: 0.2, },
    "hat02"       : {key: "dress_hat02",       name: "ハンチングぼう",           buttonScale: 0.2, },
    "hat03"       : {key: "dress_hat03",       name: "ウエスタンハット",         buttonScale: 0.2, },
    "hat04"       : {key: "dress_hat04",       name: "けいとのぼうし",           buttonScale: 0.2, },
    "accFrol"     : {key: "dress_accFrol",     name: "アクセサリー（フロル）",   buttonScale: 0.4, },
    "accMarin"    : {key: "dress_accMarin",    name: "アクセサリー（マリン）",   buttonScale: 0.4, },
    "accKirari"   : {key: "dress_accKirari",   name: "アクセサリー（キラリ）",   buttonScale: 0.4, },
    "accSilver"   : {key: "dress_accSilver",   name: "シルバーアクセサリー",     buttonScale: 0.4, },
    "accHagtan"   : {key: "dress_accHagtan",   name: "ハートアクセ",             buttonScale: 0.4, },
    "roseEarring" : {key: "dress_roseEarring", name: "バラの耳かざり",           buttonScale: 0.4, },
    "mohuEarring" : {key: "dress_mohuEarring", name: "もふもふ耳かざり",         buttonScale: 0.4, },
    "siroEarring" : {key: "dress_siroEarring", name: "中国風耳かざり",           buttonScale: 0.4, },
    "jpEarring"   : {key: "dress_jpEarring",   name: "和風耳かざり",             buttonScale: 0.4, },
    "devilWing"   : {key: "dress_devilWing",   name: "悪魔の羽",                 buttonScale: 0.4, },
    "angelWing"   : {key: "dress_angelWing",   name: "天使の羽",                 buttonScale: 0.4, },
    "bigRibbon"   : {key: "dress_bigRibbon",   name: "おおきなリボン",           buttonScale: 0.4, },
    "whiteRibbon" : {key: "dress_whiteRibbon", name: "白いリボン",               buttonScale: 0.4, },
    "santaHat"    : {key: "dress_santaHat",    name: "サンタハット",             buttonScale: 0.3, },
    "roseKatyusha": {key: "dress_roseKatyusha",name: "バラのカチューシャ",        buttonScale: 0.4, },
    "pandaEar"    : {key: "dress_pandaEar",    name: "パンダ耳",                 buttonScale: 0.4, },
    "pikakumaEar" : {key: "dress_pikakumaEar", name: "ピカピカくま耳",            buttonScale: 0.4, },
    "hairGum"     : {key: "dress_hairGum",     name: "へやごむ",                 buttonScale: 0.4, },
    "meganeMusi"  : {key: "dress_meganeMusi",  name: "メガネ虫",                 buttonScale: 0.4, },
    "rosokuHosoku": {key: "dress_rosokuHosoku",name: "ローソクほーそく",          buttonScale: 0.4, },

};

export const ShopData = {
    foods: ["ninjin", "onigiri", "cheese", "donguri", "mikan", "sasa"],
};

export const CareItemData = {
    foods: {
        ninjin : { price: 100, },
        onigiri: { price: 100, },
        cheese : { price: 100, },
        donguri: { price: 100, },
        mikan  : { price: 100, },
        sasa   : { price: 100, },
    },
}

export const FileData = {
    images: {
        dummy: "img/system/dummy.png",

        // players
        hana: "img/players/hana.png",
        ningyo: "img/players/ningyo.png",
        tensi: "img/players/tensi.png",

        // player bullets
        hana_a01: "img/players/hana_a01.png",
        ningyo_a01: "img/players/ningyo_a01.png",
        tensi_a01: "img/players/tensi_a01.png",
        sasanoha: "img/players/sasanoha.png",
        fire: "img/players/fire.png",

        // enemies
        enemy001: "img/enemies/enemy001.png",
        enemy002: "img/enemies/enemy002.png",
        kuma: "img/enemies/kuma001.png",

        wani: "img/enemies/wani.png",
        tako: "img/enemies/tako.png",
        ika: "img/enemies/ika.png",

        uzako01: "img/enemies/uzako01.png",
        uzako02: "img/enemies/uzako02.png",
        uzako03: "img/enemies/uzako03.png",
        uzako04: "img/enemies/uzako04.png",
        uzako04_light: "img/enemies/uzako04_light.png",
        baikin: "img/enemies/baikin.png",
        baikin_s: "img/enemies/baikin_s.png",

        kinoko: "img/enemies/kinoko.png",
        kinoko2: "img/enemies/kinoko2.png",
        kumo: "img/enemies/kumo.png",
        kumokumo: "img/enemies/kumokumo.png",
        kumo_ito: "img/enemies/kumo_ito.png",

        bat: "img/enemies/bat.png",
        dossun: "img/enemies/dossun.png",
        rock: "img/enemies/rock.png",

        obake_wanko: "img/enemies/obake_wanko.png",
        obake_neko: "img/enemies/obake_neko.png",
        obake_bousi: "img/enemies/obake_bousi.png",

        moon_wind1:  "img/enemies/moon_wind1.png",
        moon_wind2:  "img/enemies/moon_wind2.png",
        moon1:  "img/enemies/moon1.png",
        moon2:  "img/enemies/moon2.png",
        moon3:  "img/enemies/moon3.png",
        moons:  "img/enemies/moons.png",
        mkinoko:  "img/enemies/mkinoko.png",
        mkinoko_body:  "img/enemies/mkinoko_body.png",
        mkinoko_hair:  "img/enemies/mkinoko_hair.png",
        mkuma: "img/enemies/mkuma.png",

        // bosses
        hakase: "img/enemies/hakase.png",
        hakase_body: "img/enemies/hakase_body.png",
        hakase_nose: "img/enemies/hakase_nose.png",
        pikakuma: "img/enemies/pikakuma.png",
        musibaikin: "img/enemies/musibaikin.png",
        miminzuku: "img/enemies/mimi.png",
        gorori: "img/enemies/gorori.png",
        zombie: "img/enemies/zombie.png",
        zombie_body: "img/enemies/zombie_body.png",
        zombie_head: "img/enemies/zombie_head.png",
        majo1: "img/enemies/majo1.png",
        majo2: "img/enemies/majo2.png",
        majo2_body: "img/enemies/majo2_body.png",
        majo2_hat: "img/enemies/majo2_hat.png",
        majo2_pet: "img/enemies/majo2_pet.png",


        // boss bullets
        pika_a01: "img/enemies/pika_a01.png",
        musiba_a01: "img/enemies/musiba_a01.png",
        mimi_a01: "img/enemies/mimi_a01.png",
        zombie_a01: "img/enemies/zombie_a01.png",

        pika_kumo: "img/enemies/pika_kumo.png",
        blackhole: "img/enemies/blackhole.png",
        blackhole_b: "img/enemies/blackhole_b.png",

        magic: "img/enemies/magic.png",
        explosion:  "img/enemies/explosion.png",
        majo1_a01:  "img/enemies/majo1_a01.png",
        majo2_a01:  "img/enemies/majo2_a01.png",
        angry:   "img/enemies/ang.png",

        // back
        back01: "img/backs/back01.jpg",
        back02: "img/backs/back02.jpg",
        back03: "img/backs/back03.jpg",
        back04: "img/backs/back04.jpg",
        back05: "img/backs/back05.jpg",
        back06: "img/backs/back06.jpg",
        back07: "img/backs/back07.jpg",
        backWhite: "img/backs/white.png",

        // animals
        kago_usagi: "img/animals/kago_usagi.png",
        kago_hamu: "img/animals/kago_hamu.png",
        kago_nezumi: "img/animals/kago_nezumi.png",
        kago_risu: "img/animals/kago_risu.png",
        kago_puyorisu: "img/animals/kago_puyorisu.png",
        kago_panda: "img/animals/kago_panda.png",

        pet_usagi: "img/animals/pet_usagi.png",
        pet_hamu: "img/animals/pet_hamu.png",
        pet_nezumi: "img/animals/pet_nezumi.png",
        pet_risu: "img/animals/pet_risu.png",
        pet_puyorisu: "img/animals/pet_puyorisu.png",
        pet_panda: "img/animals/pet_panda.png",

        icon_usagi01: "img/animals/usagi01/icon.png",
        icon_usagi02: "img/animals/usagi02/icon.png",
        icon_hamu01: "img/animals/hamu01/icon.png",
        icon_hamu02: "img/animals/hamu02/icon.png",
        icon_nezumi01: "img/animals/nezumi01/icon.png",
        icon_nezumi02: "img/animals/nezumi02/icon.png",
        icon_risu01: "img/animals/risu01/icon.png",
        icon_risu02: "img/animals/risu02/icon.png",
        icon_puyorisu01: "img/animals/puyorisu01/icon.png",
        icon_puyorisu02: "img/animals/puyorisu02/icon.png",
        icon_panda01: "img/animals/panda01/icon.png",
        icon_panda02: "img/animals/panda02/icon.png",

        // dressup
        dress_hat01: "img/animals/dressup/hat01.png",
        dress_hat02: "img/animals/dressup/hat02.png",
        dress_hat03: "img/animals/dressup/hat03.png",
        dress_hat04: "img/animals/dressup/hat04.png",
        dress_accFrol: "img/animals/dressup/accFrol.png",
        dress_accMarin: "img/animals/dressup/accMarin.png",
        dress_accKirari: "img/animals/dressup/accKirari.png",
        dress_accSilver: "img/animals/dressup/accSilver.png",
        dress_accHagtan: "img/animals/dressup/accHagtan.png",
        dress_roseEarring: "img/animals/dressup/roseEarring.png",
        dress_mohuEarring: "img/animals/dressup/mohuEarring.png",
        dress_siroEarring: "img/animals/dressup/siroEarring.png",
        dress_jpEarring: "img/animals/dressup/jpEarring.png",
        dress_devilWing: "img/animals/dressup/devilWing.png",
        dress_angelWing: "img/animals/dressup/angelWing.png",
        dress_bigRibbon: "img/animals/dressup/bigRibbon.png",
        dress_whiteRibbon: "img/animals/dressup/whiteRibbon.png",
        dress_santaHat: "img/animals/dressup/santaHat.png",
        dress_roseKatyusha: "img/animals/dressup/roseKatyusha.png",
        dress_pandaEar: "img/animals/dressup/pandaEar.png",
        dress_pikakumaEar: "img/animals/dressup/pikakumaEar.png",
        dress_hairGum: "img/animals/dressup/hairGum.png",
        dress_meganeMusi: "img/animals/dressup/meganeMusi.png",
        dress_rosokuHosoku: "img/animals/dressup/rosokuHosoku.png",


        // foods
        ninjin: "img/foods/ninjin.png",
        onigiri: "img/foods/onigiri.png",
        cheese: "img/foods/cheese.png",
        donguri: "img/foods/donguri.png",
        mikan: "img/foods/mikan.png",
        sasa: "img/foods/sasa.png",

        // items
        item_b: "img/items/item_b.png",
        item_g: "img/items/item_g.png",
        item_p: "img/items/item_p.png",

        // system
        coin: "img/system/coin.png",
        config: "img/system/config.png",
        buttonFrame: "img/system/button_f.png",
        board: "img/system/board.png",
        checkBox: "img/system/checkbox.png",
        checkMark: "img/system/check.png",

        bath: "img/system/bath.png",
        awa: "img/system/awa.png",
        awamoko: "img/system/awamoko.png",

        icon_frame: "img/system/icon_frame.png",
        icon_goout: "img/system/icon_goout.png",
        icon_shop: "img/system/icon_shop.png",
        icon_osewa: "img/system/icon_osewa.png",
        icon_hand: "img/system/icon_hand.png",

        item_frame: "img/system/item_frame.png",
        left_arrow: "img/system/left_arrow.png",

        gauge_frame: "img/system/gauge_frame.png",
        gauge_fill: "img/system/gauge_fill.png",

        gacha_body_t: "img/system/gacha_body_t.png",
        gacha_body_b: "img/system/gacha_body_b.png",
        gacha_body_acc_t: "img/system/gacha_body_acc_t.png",
        gacha_body_acc_b: "img/system/gacha_body_acc_b.png",
        gacha_handle: "img/system/gacha_handle.png",
        gacha_container: "img/system/gacha_container.png",
        capsule_s: "img/system/capsule_s.png",
        capsule_t: "img/system/capsule_t.png",
        capsule_b: "img/system/capsule_b.png",
        capsule_acc_s: "img/system/capsule_acc_s.png",
        capsule_acc_b: "img/system/capsule_acc_b.png",
        figure_stand: "img/system/stand.png",

    },

    audios: {
        afternoon: {key: "afternoonBGM", dir: "audio/bgm/afternoon.mp3", volume: 1},
        myhome: {key: "myhomeBGM", dir: "audio/bgm/myhome.mp3", volume: 1},
        shop: {key: "shopBGM", dir: "audio/bgm/shop.mp3", volume: 1},
        horror: {key: "horrorBGM", dir: "audio/bgm/horror.mp3", volume: 1},

        hit01: {key: "hit01SE", dir: "audio/se/hit01.mp3", volume: 0.3},
        hit02: {key: "hit02SE", dir: "audio/se/hit02.mp3", volume: 0.3},
        explosion01: {key: "explosion01SE", dir: "audio/se/explosion01.mp3", volume: 0.5},

        // voices
        helped_usagi: {dir: "audio/voice/helped_usagi.m4a", volume: 1.5},
        helped_hamu: {dir: "audio/voice/helped_hamu.m4a", volume: 2},
    },
};

export const SelectGameData = {
    shooting: {
        imageKey: "shootingTitle", 
        imageDir: "img/backs/title.png",
        scene: "ShootingPlayerSelect",
    },
    memory: {
        imageKey: "backWhite",
        imageDir: "img/backs/backWhite.png",
        scene: "Memory",
        text: "神経衰弱"
    },
    nikaku: {
        imageKey: "backWhite",
        imageDir: "img/backs/backWhite.png",
        scene: "Nikaku",
        text: "二角パズル"
    },
    /*
    guide: {
        imageKey: "backWhite",
        imageDir: "img/backs/backWhite.png",
        scene: "GuideTitle",
        text: "導くやつ？"
    },
    */
    act2dgame: {
        imageKey: "backWhite",
        imageDir: "img/backs/backWhite.png",
        scene: "Act2dTitle",
        text: "アクション"
    },
};

export class PlayerData {
    constructor() {
        this.coin = 0;
        this.lastPlayer = "hana";
        this.lastStage = "hakase";
        this.dif = "normal";
        this.stages = {};
        this.animals = {};
        this.figures = {};
        this.accessories = {};
        this.items = {};
        this.guideStage = 1;
        this.config = {
            control: "tap",
        };
        this.lastTime = Date.now();
        this.nikakuLevel = 0;
    }
}