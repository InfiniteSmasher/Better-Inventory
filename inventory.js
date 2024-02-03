let itemData = window.mySkins = {};
window.randomizeSkin = () => { alert("The Better Inventory mod didnt load properly, please refresh!!") };

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

	// Manual (non-special) Item Check
	comp_item.computed.isManual = function() {
		return this.item.unlock == "manual" && !(this.isPremium || this.isVipItem || this.isLimited || this.isMerchItem || this.isDropsItem || this.isNotifItem || this.isLeagueItem || this.isNewYolker);
	}

	// Twitch Content Creator (shop) Item Check
	// Best way to do this is through tagging
	comp_item.computed.isTwitchCreatorItem = function() {
		return this.itemTags.includes(`item-tag-twitchcc`);
	}

	// YT Content Creator (shop) Item Check
	// Best way to do this is through tagging
	comp_item.computed.isYTCreatorItem = function() {
		return this.itemTags.includes(`item-tag-ytcc`);
	}

	// Cross-Promotional Item Check
	// Best way to do this is through tagging
	comp_item.computed.isPromo = function() {
		return this.itemTags.includes(`item-tag-promo`);
	}

	// Event Item Check
	// Best way to do this is through tagging
	comp_item.computed.isEvent = function() {
		return this.itemTags.includes(`item-tag-event`);
	}

	// Homepage Social Item Check
	// Best way to do this is through tagging
	comp_item.computed.isSocial = function() {
		return this.itemTags.includes(`item-tag-social`);
	}

	// Creator Item Check
	comp_item.computed.isCreatorItem = function() {
		return this.isYTCreatorItem || this.isTwitchCreatorItem;
	}

	// Special Manual Item Check
	comp_item.computed.isSpecialItem = function() {
		return this.isPromo || this.isEvent || this.isSocial;
	}

	// Banner Check
	comp_item.computed.hasBanner = function() {
		return this.isPremium || this.isVipItem || this.isLimited || this.isMerchItem || this.isDropsItem || this.isNotifItem || this.isLeagueItem || this.isNewYolker || this.isManual || this.isCreatorItem || this.isSpecialItem;
	}

	// Add Banner Text
	comp_item.computed.bannerTxt = function() {
		if (!this.hasBanner) {
			return;
		} else {
			if (this.isPremium) {
				return 'Premium';
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
			if (this.isManual && !this.isSpecialItem) {
				return 'Egglite';
			}
			if (this.isYTCreatorItem) {
				return 'YT CC';
			}
			if (this.isTwitchCreatorItem) {
				return 'Twitch CC';
			}
			if (this.isLimited) {
				return 'Limited';
			}
			if (this.isSocial) {
				return 'Social';
			}
			if (this.isPromo) {
				return 'Promo';
			}
			if (this.isEvent) {
				return 'Event';
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
			'is-egglite': (this.isManual && !this.isSpecialItem),
			'is-manual': this.isManual,
			'is-creator-yt': this.isYTCreatorItem,
			'is-creator-twitch': this.isTwitchCreatorItem
		}
	}

	// Tooltips
	comp_item.computed.tooltip = function() {
		if (this.showTooltip) {
			let type = "";
			if (this.isLimited) {
				type = " limited"
			} else if (this.isPremium) {
				type = " premium"
			} else if (this.isVipItem) {
				type = " vip"
			} else if (this.isMerchItem) {
				type = " merch"
			} else if (this.isDropsItem) {
				type = " drops"
			} else if (this.isNewYolker) {
				type = " ny"
			} else if (this.isNotifItem) {
				type = " notif"
			} else if (this.isLeagueItem) {
				type = " league"
			} else if (this.isManual) {
				type = " manual"
			} else if (this.isYTCreatorItem) {
				type = " ytcc"
			} else if (this.isTwitchCreatorItem) {
				type = " twitchcc"
			}
			return 'tool-tip' + type;
		}
	}

	// Modify Item Sorting (Order)
	// Premium --> VIP --> Merch --> Drops --> Yolker --> League --> Notif --> Egglite --> Promo --> Event --> Social --> Default --> Limited --> Creator --> Shop
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

			// Notif Item Sorting (using "reward" tags
			let isNotifA = checkA && a.item_data.tags.some(tag => tag.toLowerCase().includes("reward"));
			let isNotifB = checkB && b.item_data.tags.some(tag => tag.toLowerCase().includes("reward"));
			if (isNotifA && !isNotifB) return 1;
			if (!isNotifA && isNotifB) return -1;

			// Special Manual Item Sorting (using tags)
			let isPromoA = checkA && a.item_data.tags.some(tag => tag.toLowerCase() == "promo");
			let isPromoB = checkA && b.item_data.tags.some(tag => tag.toLowerCase() == "promo");
			let isEventA = checkA && a.item_data.tags.some(tag => tag.toLowerCase() == "event");
			let isEventB = checkA && b.item_data.tags.some(tag => tag.toLowerCase() == "event");
			let isSocialA = checkA && a.item_data.tags.some(tag => tag.toLowerCase() == "social");
			let isSocialB = checkA && b.item_data.tags.some(tag => tag.toLowerCase() == "social");

			let isEggliteA = checkA && !(isPromoA || isEventA || isSocialA);
			let isEggliteB = checkB && !(isPromoB || isEventB || isSocialB);

			// Egglite
			if (isEggliteA && !isEggliteB) return 1;
			if (!isEggliteA && isEggliteB) return -1;

			// Promo
			if (isPromoA && !isPromoB) return 1;
			if (!isPromoA && isPromoB) return -1;

			// Event
			if (isEventA && !isEventB) return 1;
			if (!isEventA && isEventB) return -1;

			// Social
			if (isSocialA && !isSocialB) return 1;
			if (!isSocialA && isSocialB) return -1;
			
			/*
			if (a.unlock === 'manual' && b.unlock !== 'manual') return 1;
			if (a.unlock !== 'manual' && b.unlock === 'manual') return -1;
			*/
			
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

	let setSkinInterval = setInterval(() => {
		if (typeof (vueApp) === "undefined" || !vueApp.authCompleted || !vueApp.onSignOutClicked) return;
		clearInterval(setSkinInterval);
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
	}, 100);
}

// Add needed tags to items - hopefully this will be done natively, BWD will get around to it...eventually :)
function setupItemTags() {
	// Wait for specialItemsTag and catalog to be initialized
	// I could just fetch shellshock.io/data/housePromo.json to get the specialItemsTag
	let itemTagInterval = setInterval(() => {
		if (typeof (extern) === "undefined" || !extern.catalog || !extern.specialItemsTag) return;
		clearInterval(itemTagInterval);
		
		// Add or Remove Missing/Wrong Item Tags
		itemData.tagEdits.forEach(edit => {
			let item = extern.catalog.findItemById(edit.itemId);
			if (!item) return;
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			edit.itemTags.forEach(tag => {
				let includes = item.item_data.tags.includes(tag);
				if (edit.add && !includes) {
					item.item_data.tags.push(tag);
				} else if (includes) {
					item.item_data.tags.splice(item.item_data.tags.indexOf(tag), 1);
				}
			});
		});

		// Add "Limited" tag to Monthly Featured Items
		extern.catalog.getTaggedItems(extern.specialItemsTag).forEach(item => {
			if (!item.item_data.tags) {
				item.item_data.tags = [];
			}
			if (item.item_data.tags.includes("Limited")) return;
			item.item_data.tags.push("Limited");
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

window.randomizeSkin = () => {
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
	for (let item of Object.values(randomItems)) {
		if (item) {
			extern.tryEquipItem(item);
		}
	}
	extern.poseWithItems(randomItems);
	extern.setShellColor(Math.floor(Math.random() * (mySkins.maxColor + 1)));
	vueApp.$refs.equipScreen.updateEquippedItems();
	BAWK.play("ui_equip");
}

function initBetterInventory() {
	let vueAppInterval = setInterval(() => {
		if (typeof (vueApp) === "undefined") return;
		clearInterval(vueAppInterval);
		vueApp.loc.eq_search_items = "Search Items";
		let oldLocFunc = vueApp.setLocData;
		vueApp.setLocData = (languageCode, newLocData) => {
			oldLocFunc(languageCode, newLocData);
			vueApp.loc.eq_search_items = "Search Items";
		};
	
		vueApp.equip.getItemTotals = () => {
			if (!vueApp.equip.categoryLocKey) return 0;
			const [category, subCategory] = vueApp.equip.categoryLocKey.split("_").slice(-2).map(Number);
			const itemTotals = {
				[ItemType.Hat]: extern.catalog.hats.length,
				[ItemType.Stamp]: extern.catalog.stamps.length,
				[ItemType.Primary]: extern.catalog.primaryWeapons,
				[ItemType.Secondary]: extern.catalog.secondaryWeapons.length,
				[ItemType.Grenade]: extern.catalog.grenades.length,
				[ItemType.Melee]: extern.catalog.melee.length
			};
			if (parseInt(category) == ItemType.Primary) {
				return itemTotals[category].filter(item => item.exclusive_for_class == subCategory).length;
			}
			return itemTotals[subCategory];
		};
	}, 100);
	
	let betterInventoryUpdateCheckElem = document.getElementById("betterInventoryUpdateCheck");
	if (typeof(betterInventoryUpdateCheckElem) == "undefined" || betterInventoryUpdateCheckElem.dataset.version < 2) {
		alert("Hello Gamer!\n\nIt looks like your version of Better Inventory isn't updated to the latest version.");
		alert("To ensure that you receive future updates with all the latest features, go to Tampermonkey settings and make sure that the \"Update Interval\" setting under the \"Externals\" category is set to \"Always\".");
		alert("Thanks for using Better Inventory, enjoy the added features!\n- Infinite Smasher :)");
	};
}

// Get Item Data JSON, Start Mod
fetch("https://cdn.jsdelivr.net/gh/InfiniteSmasher/Better-Inventory@latest/modData.json")
	.then(res => res.json())
	.then(res => {
		itemData = res;
		setupItemTags();
		makeVueChanges();
	});

initBetterInventory();
