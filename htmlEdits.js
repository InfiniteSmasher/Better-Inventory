let equipTemplate = document.getElementById("equip-screen-template");
equipTemplate.innerHTML = equipTemplate.innerHTML.replace(
	`" v-on:keyup="onItemSearchChange" class="ss_field font-nunito box_relative fullwidth">`,
	`" v-on:keyup="onItemSearchChange" class="ss_field font-nunito roundme_lg box_relative" :class="{'limited-input' : isOnEquipModeFeatured}">
 	<button id="randomize-button" onclick="randomizeSkin()" v-show="isEquipModeInventory" class="ss_button roundme_lg btn_blue bevel_blue btn-account-w-icon random-button">
		<i class="fas fa-random"></i>
	</button>
`);

equipTemplate.innerHTML = equipTemplate.innerHTML.replace(
	`class="item-search-wrap box_relative"`, 
	`class="item-search-wrap box_relative" :class="{'inventory-skin-search' : isEquipModeInventory, 'shop-skin-search' : isOnEquipModeSkins || isOnEquipModeFeatured}"
`);
