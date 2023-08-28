comp_item.data = function() {
	return {
		itemOnly: hasValue(this.showItemOnly) ? this.showItemOnly : false,
		active: true,
		itemLimited: false,
		itemUnlock: 'purchase',
		itemTags: [],
		itemTagsString: '',
		searchString: '',
		premTxt: {
			title: '',
			desc: ''
		}
	}
}

comp_item.methods.setUpTags = function() {
	this.searchString = this.item.name + ' ' + (this.item.item_data.meshName ? this.item.item_data.meshName : '') + ' ' + (this.item.item_data.tags ? this.item.item_data.tags.join(' ') : '');
	if (this.item.item_data !== undefined && this.item.item_data.tags !== undefined && this.item.item_data.tags.length) {
		this.item.item_data.tags.forEach(el => this.itemTags.push('item-tag-' + el.toLowerCase().replace(/\s+/g, '-')));
		this.itemTagsString = this.itemTags.toString().replace(/,/g, ' ');
	}
}

let equipTemplate = document.getElementById("equip-screen-template");
equipTemplate.innerHTML = equipTemplate.innerHTML.replace(`d" id="item_grid"`, `d" id="item_grid" class="search_grid"`).replace(`<egg-store`, `<div v-show="isOnShopInventoryLimited" :class="{'inventory-skin-search' : isEquipModeInventory, 'shop-skin-search' : isOnEquipModeSkins || isOnEquipModeFeatured}">
	<div>
		<label for="search-skins" class="centered_y">
			<i class="fas fa-search text_blue3"></i>
		</label>
		<input onkeyup="onSkinSearch(this.value)" name="search-skins" :placeholder="['Search Skins' + (isEquipModeInventory ? window.cmdStr : '')]" class="ss_field font-nunito" :class="{'limited-input' : isOnEquipModeFeatured}">
	</div>
 	<button id="randomize-button" onclick="randomizeSkin()" v-show="isEquipModeInventory" class="ss_button roundme_lg btn_blue bevel_blue btn-account-w-icon random-button">
		<i class="fas fa-random"></i>
	</button>
</div>
<egg-store`);

let itemTemplate = document.getElementById("item-template");
itemTemplate.innerHTML = itemTemplate.innerHTML.replace(`eggItemInvetory"`, `eggItemInvetory" id="an_item" :title="[item.name]" :data-search="[searchString]"`);

let colorTemplate = document.getElementById("color-select-template");
colorTemplate.innerHTML = colorTemplate.innerHTML.replace(`<!-- </div>`, `<button onclick="randomizeColor(true)" class="ss_button roundme_lg btn_blue bevel_blue btn-account-w-icon">
	<i class="fas fa-random"></i>
</button>
<!-- </div>`);
