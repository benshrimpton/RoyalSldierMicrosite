var slider = $(".royalSlider").royalSlider({
	// general options go gere
	//autoScaleSlider: true,
	imageScaleMode : 'fill',
	historyOptions: {
		enabled: true
	},
	deeplinking: {
		enabled: true,
		change: true,
		prefix: 'slide-'
	}
}).data('royalSlider'); 

function toggleMenu(){
		$('.menu, #menu-trigger').toggleClass('visible'); 
}
$('#menu-trigger').click(toggleMenu);

$('.menu-list a').click(function(){
	toggleMenu();
	$('.menu-list a').removeClass('current')
	$(this).addClass('current');
});
