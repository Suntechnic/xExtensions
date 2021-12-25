<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
    die();
}

return [
    'js' =>[
        '/local/js/x/vue/loader/dist/script.js',
    ],
    'rel' => [
		'ui.vue',
	],
    'skip_core' => true,
];