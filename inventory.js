let itemData = window.mySkins = {};
const errorFunc = () => { alert("The Better Inventory mod didnt load properly, please refresh!!") };
window.onSkinSearch = window.randomizeSkin = window.randomizeColor = errorFunc;
window.randomMode = 0;
window.cmdStr = "";

function makeVueChanges() {
	// Merch ("physical" unlock) Item Check
	// This is perfect! Quick and easy to check.
	comp_item.computed.isMerchItem = function() {
		return this.item.unlock == "physical";
	}

	// Twitch Drops Item Check 
	// No native "twitch" unlock type yet
	comp_item.computed.isDropsItem = function() {
		return this.item.unlock == "manual" && this.itemTags.some(tag => tag.includes("drops"));
	}

	// Notification Item Check
	// No native "notification" unlock type yet
	comp_item.computed.isNotifItem = function() {
		return this.item.unlock == "manual" && this.itemTags.includes('item-tag-reward');
	}

	// League Item Check
	// Best way to do this is through tagging
	comp_item.computed.isLeagueItem = function() {
		return this.item.unlock == "manual" && this.itemTags.some(tag => itemData.leagueTags.includes(tag.split('-').reverse()[0]));
	}

	// New Yolker Item Check
	// No native "newsletter" unlock type yet
	comp_item.computed.isNewYolker = function() {
		return !this.isLimited && this.itemTags.includes('item-tag-newsletter');
	}

	// Redeemed (manual, non-special) Item Check
	// No native "redeemed" unlock type yet
	comp_item.computed.isRedeemed = function() {
		return this.item.unlock == "manual" && !(this.isPremium || this.isVipItem || this.isLimited || this.isMerchItem || this.isDropsItem || this.isNotifItem || this.isLeagueItem || this.isNewYolker);
	}

	// Twitch Content Creator (shop) Item Check
	// Best way to do this is through tagging
	comp_item.computed.isTwitchCreatorItem = function() {
		return this.itemTags.includes('item-tag-twitchcc');
	}

	// YT Content Creator (shop) Item Check
	// Best way to do this is through tagging
	comp_item.computed.isYTCreatorItem = function() {
		return this.itemTags.includes('item-tag-ytcc');
	}

	// Banner Check
	comp_item.computed.hasBanner = function() {
		return this.isPremium || this.isVipItem || this.isLimited || this.isMerchItem || this.isDropsItem || this.isNotifItem || this.isLeagueItem || this.isNewYolker || this.isRedeemed || this.isYTCreatorItem || this.isTwitchCreatorItem;
	}

	// Add Banner Text
	comp_item.computed.bannerTxt = function() {
		if (!this.hasBanner) {
			return;
		} else {
			if (this.isPremium) {
				return this.loc.p_premium_item_banner_txt;
			}
			if (this.isVipItem) {
				return 'VIP';
			}
			if (this.isMerchItem) {
				return 'Merch';
			}
			if (this.isDropsItem) {
				return 'Drops';
			}
			if (this.isNotifItem) {
				return 'Notif';
			}
			if (this.isLeagueItem) {
				return 'League';
			}
			if (this.isNewYolker) {
				return 'Yolker';
			}
			if (this.isRedeemed) {
				return 'Redeemed';
			}
			if (this.isYTCreatorItem) {
				return 'YT CC';
			}
			if (this.isTwitchCreatorItem) {
				return 'Twitch CC';
			}
			if (this.isLimited) {
				return this.loc.eq_limited;
			}
		}
	}

	// Add CSS Classes
	comp_item.computed.itemClass = function() {
		return {
			'highlight': this.isSelected,
			'is-premium': this.isPremium,
			'is-vip': this.isVipItem,
			'is-merch': this.isMerchItem,
			'is-drops': this.isDropsItem,
			'is-ny': this.isNewYolker,
			'is-notif': this.isNotifItem,
			'is-league': this.isLeagueItem,
			'is-redeemed': this.isRedeemed,
			'is-creator-yt': this.isYTCreatorItem,
			'is-creator-twitch': this.isTwitchCreatorItem
		}
	}

	// Modify Item Sorting (Order)
	// Premium --> VIP --> Merch --> Drops --> Yolker --> League --> Redeemed --> Default --> Limited --> Creator --> Purchase...
	comp_item_grid.computed.itemsSorted = function() {
		return this.items.sort((b, a) => {
			if (a.unlock === 'premium' && b.unlock !== 'premium') return 1;
			if (a.unlock !== 'premium' && b.unlock === 'premium') return -1;
			if (a.unlock === 'vip' && b.unlock !== 'vip') return 1;
			if (a.unlock !== 'vip' && b.unlock === 'vip') return -1;
			if (a.unlock === 'physical' && b.unlock !== 'physical') return 1;
			if (a.unlock !== 'physical' && b.unlock === 'physical') return -1;

			// Check if items have tags
			let tagsA = typeof (a.item_data.tags) !== 'undefined';
			let tagsB = typeof (b.item_data.tags) !== 'undefined';

			// Check if items are manual unlock and have tags
			let checkA = a.unlock == "manual" && tagsA;
			let checkB = b.unlock == "manual" && tagsB;

			// Twitch Drop Sorting (Using "drops<x>" tags + manual unlock check)
			let isDropsA = checkA && a.item_data.tags.some(tag => tag.toLowerCase().includes("drops"));
			let isDropsB = checkB && b.item_data.tags.some(tag => tag.toLowerCase().includes("drops"));
			if (isDropsA && !isDropsB) return 1;
			if (!isDropsA && isDropsB) return -1;

			// New Yolker Sorting (Using "newsletter" tag)
			let isYolkerA = checkA && a.item_data.tags.some(tag => tag.toLowerCase().includes("newsletter"));
			let isYolkerB = checkB && b.item_data.tags.some(tag => tag.toLowerCase().includes("newsletter"));
			if (isYolkerA && !isYolkerB) return 1;
			if (!isYolkerA && isYolkerB) return -1;

			// League Item Sorting (Using league tags)
			let isLeagueA = checkA && a.item_data.tags.some(tag => itemData.leagueTags.includes(tag.toLowerCase()));
			let isLeagueB = checkB && b.item_data.tags.some(tag => itemData.leagueTags.includes(tag.toLowerCase()));
			if (isLeagueA && !isLeagueB) return 1;
			if (!isLeagueA && isLeagueB) return -1;

			if (a.unlock === 'manual' && b.unlock !== 'manual') return 1;
			if (a.unlock !== 'manual' && b.unlock === 'manual') return -1;
			if (a.unlock === 'default' && b.unlock !== 'default') return 1;
			if (a.unlock !== 'default' && b.unlock === 'default') return -1;

			// Limited Item Sorting
			let isLimitedA = tagsA && a.item_data.tags.some(tag => tag.toLowerCase().includes("limited"));
			let isLimitedB = tagsB && b.item_data.tags.some(tag => tag.toLowerCase().includes("limited"));
			if (!isDropsA && isLimitedA && !isLimitedB) return 1;
			if (!isDropsB && !isLimitedA && isLimitedB) return -1;

			// Creator Item Sorting (Using cc tags)
			let isCreatorA = tagsA && a.item_data.tags.some(tag => itemData.creatorTags.includes(tag.toLowerCase()));
			let isCreatorB = tagsB && b.item_data.tags.some(tag => itemData.creatorTags.includes(tag.toLowerCase()));
			if (isCreatorA && !isCreatorB) return 1;
			if (!isCreatorA && isCreatorB) return -1;

			if (a.unlock === 'purchase' && b.unlock !== 'purchase') return 1;
			if (a.unlock !== 'purchase' && b.unlock === 'purchase') return -1;
			return 0;
		});
	}
	vueApp.authCompleted = function() {
		setMySkins();
		this.accountSettled = true;
		if (vueApp.$refs.firebaseSignInPopup.isShowing) this.hideFirebaseSignIn();
	}
	vueApp.onSignOutClicked = function() {
		setTimeout(setMySkins, 500);
		BAWK.play('ui_reset');
		this.$refs.homeScreen.onSignOutClicked();
	}
}

// Add needed tags to items - hopefully this will be done natively, BWD will get around to it...eventually :)
function setupItemTags() {
	// Wait for specialItemsTag and catalog to be initialized
	// I could just fetch shellshock.io/data/housePromo.json to get the specialItemsTag
	let interval = setInterval(() => {
		if (!extern.catalog || !extern.specialItemsTag) return;
		clearInterval(interval);

		// Add "Limited" tag to Monthly Featured Items
		extern.catalog.getTaggedItems(extern.specialItemsTag).forEach(item => {
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			if (item.item_data.tags.includes("Limited")) return;
			item.item_data.tags.push("Limited");
		});

		// Add "Newsletter" tag to New Yolkers that don't have them yet (BWD forgot about these smh)
		extern.catalog.findItemsByIds(itemData.yolkerIds).forEach(item => {
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			if (item.item_data.tags.includes("Newsletter")) return;
			item.item_data.tags.push("Newsletter");
		});

		// Add "League" tag to League Items that don't have them yet (BWD forgot about these smh)
		extern.catalog.findItemsByIds(itemData.leagueIds).forEach(item => {
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			if (item.item_data.tags.includes("League")) return;
			item.item_data.tags.push("League");
		});

		// Add "Creator" and Social Type tags to Content Creator Shop Items
		itemData.creatorItems.forEach(creatorItem => {
			let item = extern.catalog.findItemById(creatorItem.itemId);
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			if (item.item_data.tags.includes(`${creatorItem.socialType}CC`)) return;
			item.item_data.tags.push(`${creatorItem.socialType}CC`);
		});

		// Remove "Drops2" tag from EGG ORG Shattered Crest Stamp
		extern.catalog.findItemById(2263).item_data.tags.pop();
	}, 250);
}

function setMySkins() {
	let f = (x) => extern.account.isItemOwned(x) || x.unlock == "default";
	window.mySkins = {
		hats: extern.catalog.hats.filter(f),
		stamps: extern.catalog.stamps.filter(f),
		primaries: extern.catalog.primaryWeapons.filter(f),
		secondaries: extern.catalog.secondaryWeapons.filter(f),
		grenades: extern.catalog.grenades.filter(f),
		melees: extern.catalog.melee.filter(f),
		maxColor: (extern.account.isUpgraded() || extern.account.isSubscriber) ? 13 : 6
	};
}

// Function for skin search
window.onSkinSearch = function(val) {
	let searchStr = val.toLowerCase();
	let randomButton = document.getElementById("randomize-button");
	const regex1 = new RegExp(`^${itemData.cmdAll}(\\s*(.+))?`);
	const regex2 = new RegExp(`^${itemData.cmdColor}(\\s*(.+))?`);
	let mode = 0;
	
	if (regex1.test(searchStr)) {
		mode = 1;
	}
	if (regex2.test(searchStr)) {
		mode = 2;
	}

	if (window.randomMode != mode) {
		window.randomMode = mode;
		if (window.randomMode > 0) {
			if (window.randomMode == 1) {
				randomButton.className = randomButton.className.replaceAll("blue", "green").replaceAll("rainbow", "green");
				BAWK.play("kotc_capture");
			} else if (window.randomMode == 2) {
				randomButton.className = randomButton.className.replaceAll("blue", "rainbow").replaceAll("green", "rainbow");
				BAWK.play("kotc_pointscore");
			}
		} else {
			randomButton.className = randomButton.className.replaceAll("green", "blue").replaceAll("rainbow", "blue");
		}
	}

	if (window.randomMode > 0) {
		let match1 = searchStr.match(regex1);
		let match2 = searchStr.match(regex2);
		
		if (match1) {
			searchStr = match1[1]
		}
		if (match2) {
			searchStr = match2[1]
		}
		
		if (val == itemData.cmdAll || val == itemData.cmdColor) {
			searchStr = "";
		}
	}

	if (searchStr != null) {
		searchStr = searchStr.trim();
		let itemGrid = document.getElementById("equip_sidebox").querySelector("#item_grid #equip_grid");
		for (const div of itemGrid.childNodes) {
			if (div.className && div.className == "box_relative center_h") {
				div.style.display = (!div.querySelector("#an_item").getAttribute("data-search").toLowerCase().includes(searchStr.toLowerCase())) ? "none" : "";
			}
		}
	}
}

window.randomizeSkin = () => {
	if (window.randomMode > 0 && document.getElementsByName("search-skins")) {
		window.onSkinSearch(document.getElementsByName("search-skins")[0].value);
	}
	let categories = ["Soldier", "Scrambler", "Ranger", "Eggsploder", "Whipper", "Crackshot", "TriHard"];
	let primaryItems = mySkins.primaries.filter(x => x.category_name.includes(categories[vueApp.classIdx]));
	let randomItems = {
		[ItemType.Hat]: mySkins.hats[Math.floor(Math.random() * mySkins.hats.length)],
		[ItemType.Stamp]: mySkins.stamps[Math.floor(Math.random() * mySkins.stamps.length)],
		[ItemType.Primary]: primaryItems[Math.floor(Math.random() * primaryItems.length)],
		[ItemType.Secondary]: mySkins.secondaries[Math.floor(Math.random() * mySkins.secondaries.length)],
		[ItemType.Grenade]: mySkins.grenades[Math.floor(Math.random() * mySkins.grenades.length)],
		[ItemType.Melee]: mySkins.melees[Math.floor(Math.random() * mySkins.melees.length)],
	};

	vueData.equip.selectedItem = randomItems[vueApp.equip.selectedItemType];
	for (let [typeId, item] of Object.entries(randomItems)) {
		if (window.randomMode == 0 && typeId != vueApp.equip.selectedItemType) {
			delete randomItems[typeId];
			item = extern.getEquippedItems()[typeId];
		}
		if (item) {
			extern.tryEquipItem(item);
		}
	}
	if (window.randomMode == 2) {
		window.randomizeColor();
	}
	extern.poseWithItems(randomItems);
	vueApp.$refs.equipScreen.updateEquippedItems();
	BAWK.play("ui_equip");
}

window.randomizeColor = (playSound) => {
	playSound = hasValue(playSound);
	if (playSound) {
		BAWK.play("ui_onchange");
	}
	extern.setShellColor(Math.floor(Math.random() * (mySkins.maxColor + 1)));
};

// Get Item Data JSON, Start Mod
fetch("https://cdn.jsdelivr.net/gh/InfiniteSmasher/Better-Inventory@latest/itemData.json")
	.then(res => res.json())
	.then(res => {
		itemData = res;
		window.cmdStr = ` (try ${itemData.cmdAll} or ${itemData.cmdColor})`;
		let randomButton = document.getElementById("randomize-button");
		if (randomButton) {
			randomButton.title = `Type ${itemData.cmdAll} in search bar to randomize all skins and ${itemData.cmdColor} to also randomize colors!`;
		}
		setupItemTags();
		makeVueChanges();
	});
