function toggleMenu(){$(".menu, #menu-trigger").toggleClass("visible")}var slider=$(".royalSlider").royalSlider({imageScaleMode:"fill",historyOptions:{enabled:!0},deeplinking:{enabled:!0,change:!0,prefix:"slide-"}}).data("royalSlider");$("#menu-trigger").click(toggleMenu),$(".menu-list a").click(function(){toggleMenu(),$(".menu-list a").removeClass("current"),$(this).addClass("current")});