'use strict'

import SceneBase from "./SceneBase.js";
import {TextButton, SelectButton} from "../ui/Button.js";
import {ShopData, FileData, CareItemData} from "../Database.js";


export default class ShopScene extends SceneBase {
	constructor() {
		super({ key: 'Shop', active: false });
	}

	preload() {
		//this.load.audio("shopBGM", FileData.audios["shop"].dir);
		this.preloadAudio("shop");

		this.loadBackWhite();
		this.loadButtonFrame();
		this.load.image('hukidasi', 'img/system/hukidasi.png');
		this.load.image('staff', 'img/system/staff.png');
		this.load.image('window', 'img/system/window_talk.png');
		this.load.image("coin", FileData.images.coin);
	
		ShopData.foods.forEach(key => this.load.image(key, FileData.images[key]));
	}

	create() {
		this.playBGM("shop");
		this.backImage = this.add.image(0, 0, 'backWhite').setOrigin(0, 0);
		this.staff = this.add.image(this.game.config.width / 2, -48, 'staff').setOrigin(0.5, 0);
		this.hukidasi = this.add.image(520, 160, 'hukidasi').setOrigin(0, 0);
		this.staffTalk = this.add.text(580, 230, "どれにしますか～", {fontFamily:"メイリオ", fontSize:18, color:"#ff6644"}).setOrigin(0,0.5);
		this.shopWindow = this.add.image(33, 353, 'window').setOrigin(0, 0);

		const btnX = 96, btnY = 64;
		const buttonFrameKey = "buttonFrame";
		this.buttons = {
			food   : new TextButton(this, btnX, btnY + 56 * 1, "フード"  , buttonFrameKey, this.setFoodShop.bind(this)),
			b001   : new TextButton(this, btnX, btnY + 56 * 2, ""  , buttonFrameKey, this.setFoodShop.bind(this)),
			gacha  : new TextButton(this, btnX, btnY + 56 * 3, "ガチャ"  , buttonFrameKey, this.gotoScene.bind(this, "Gacha", false)),
			return : new TextButton(this, btnX, btnY + 56 * 0, "もどる"  , buttonFrameKey, this.returnScene.bind(this)),
			buy    : new TextButton(this, this.game.config.width - 128, 320, "かう", buttonFrameKey, this.buyItem.bind(this)),
		};

		this.foods = {};
		this.foodsIndex = {};
		this.priceTexts = [];
		this.numText = [];
		const itemX = 128, itemY = 400;
		this.coinImage = this.add.image(50, itemY - 92, "coin").setOrigin(0, 0);
		this.coinText = this.add.text(96, itemY - 80, window.playerData.coin, {fontFamily: "メイリオ", fontSize:24, color: "#aa0066"}).setOrigin(0, 0);
		ShopData.foods.forEach((key, i) => {
			this.foods[key] = new SelectButton(
				this, key, key, itemX + i * 96, itemY, 128, 128, this.selectItem.bind(this, key), this.foods, {scale: 0.5, selectColor: 0xffaacc});
			this.priceTexts[i] = this.add.text(itemX + i * 96, itemY + 32, CareItemData.foods[key].price, {fontFamily: "メイリオ", fontSize:20, color: "#aa0066"}).setOrigin(0.5, 0);
			this.numText[i] = this.add.text(itemX + i * 96 + 32, itemY - 32, window.playerData.items[key] || 0, {fontFamily: "メイリオ", fontSize:20, color: "#cc6600"}).setOrigin(1, 0);
			this.foodsIndex[key] = i;
		});
		
		this.foods[ShopData.foods[0]].select();
	}

	update() {
	}

	selectItem(key) {
		this.selectedItem = key;
		this.setBuyButtonValid();
	}

	buyItem() {
		if (window.playerData.coin >= this.cost) {
			this.staffTalk.setText("ありがとう\nございます～");
			window.playerData.coin -= this.cost;
			window.playerData.items[this.selectedItem] ||= 0;
			window.playerData.items[this.selectedItem] += 1;
			this.coinText.setText(window.playerData.coin);
			this.setBuyButtonValid();
			this.numText[this.foodsIndex[this.selectedItem]].setText(window.playerData.items[this.selectedItem]);
			this.save();
		} else {
			this.staffTalk.setText("おかねが\nたりてません！");
		}
	}

	setBuyButtonValid() {
		const key = this.selectedItem;
		this.cost = CareItemData.foods[key].price;

		if (window.playerData.coin >= this.cost) {
			this.buttons.buy.setValid(true);
		} else {
			this.buttons.buy.setValid(false);
		}
	}

	setFoodShop() {
		this.shopType = "food";
	}

}

