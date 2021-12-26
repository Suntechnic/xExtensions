<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
    die();
}

return [
    'js' =>[
        'dist/script.js',
    ],
    'rel' => [
		'ui.vue',
        //'main.polyfill.core',
	],
    'skip_core' => false,
];