// Add Random Skin Button, Searchbar Class Edits, and Item Amount
let equipTemplate = document.getElementById("equip-screen-template");
equipTemplate.innerHTML = equipTemplate.innerHTML.replace(
	`" v-on:keyup="onItemSearchChange" class="ss_field font-nunito box_relative fullwidth">`,
	`" v-on:keyup="onItemSearchChange" class="ss_field font-nunito roundme_lg box_relative" :class="{'limited-input' : isOnEquipModeFeatured}">
	<button id="randomize-button" onclick="randomizeSkin()" v-show="isEquipModeInventory" class="ss_button roundme_lg btn_blue bevel_blue btn-account-w-icon random-button">
		<i class="fas fa-random"></i>
	</button>`
).replace(
	`class="item-search-wrap box_relative"`,
	`class="item-search-wrap box_relative" :class="{'inventory-skin-search' : isEquipModeInventory, 'shop-skin-search' : isOnEquipModeSkins || isOnEquipModeFeatured}"`
).replace(
	`categoryLocKey] }}`,
	`categoryLocKey] }} ({{ equip.showingItems.length }}/{{ (equip.getItemTotals) ? equip.getItemTotals() : 0 }})`
).replace(
	`onRedeemClick">{{`,
	`onRedeemClick"><i class="fas fa-unlock"></i> {{`
).replace(
	`inGame">{{`,
	`inGame"><i class="fas fa-camera"></i> {{`
);

// Add Item Icons
document.getElementById("item-template").innerHTML = document.getElementById("item-template").innerHTML.replace(`<span v-if="isVipItem`,
	`<i v-if="hasIcon" :class="iconClass" class="item-icon" @click.stop="iconClick"></i> 
	<span @click.stop="iconClick" v-if="isVipItem`
);

// Add Profile Image and Badges
document.getElementById("profile-screen-template").innerHTML = document.getElementById("profile-screen-template").innerHTML.replace(
	`center">\n\t\t\t\t\t<section>`, 
	`center">
	 <div id="player_photo" v-show="photoUrl !== null && photoUrl !== undefined && photoUrl !== '' && ! isAnonymous">
	 <img :src="photoUrl" class="roundme_md"/>
  </div><section>`).replace(`s"></p>`, `s"></p>
	<div id="profile-badges" v-if="vueApp != undefined && vueApp.hasProfileBadges()" class="roundme_md profile-badge-container">
		<span v-if="vueApp != undefined && vueApp.hasMainBadges()" class="main-badges">
				<i
					v-for="badge in (vueApp != undefined) ? vueApp.getMainBadges() : []"
					:title="badge.title"
					:class="badge.classList"
					@click="badge.clickFunc"
				>
				</i>
		</span>
		<i v-if="(vueApp != undefined && vueApp.hasMainBadges()) && contentCreator" class="fas fa-grip-lines-vertical badge-separator"></i>
		<span v-if="contentCreator" class="social-badges">
				<i
					v-for="badge in (vueApp != undefined) ? vueApp.getSocialBadges() : []"
					:title="badge.title"
					:class="badge.classList"
					@click="badge.clickFunc"
				>
				</i>
		</span>
	</div>
`);

// Add Footer Changelog
document.getElementById("footer-links-panel-template").innerHTML = document.getElementById("footer-links-panel-template").innerHTML.replace(
	`version }}</button> | `,
	`version }}</button> | 
	<button id="betterInv-footer" class="ss_button_as_text" target="_blank" @click="openInNewTab('https://github.com/InfiniteSmasher/Better-Inventory/blob/a965b2b37da2db98e02675863154ca21d62bb749/info.md')">Better Inventory</button> | `);


// Adjust size of stats container for badges
document.getElementById("stats-stats-template").innerHTML = document.getElementById("stats-stats-template").innerHTML.replace(
	`class="stats-container`,
	`:class="{'shorter-stats-container' : vueApp != undefined && vueApp.hasProfileBadges()}" id="statsCont-fix" class="stats-container`
);

// The (not) bigbrain version check method
document.head.innerHTML += `<div id="betterInventoryUpdateCheck" data-ids="['betterInv-footer', 'statsCont-fix', 'randomize-button', 'profile-badges']" data-version="3"></div>`;

/*
let betterInventoryUpdateCheck = document.createElement('div');
betterInventoryUpdateCheck.id = "betterInventoryUpdateCheck";
betterInventoryUpdateCheck.dataset.success = ["profile-badges"].every(id => document.getElementById(id));
betterInventoryUpdateCheck.dataset.version = 2;
document.head.appendChild(betterInventoryUpdateCheck);
*/
