<?php
/**
 * Tech My Space headless theme.
 *
 * Activate in Local, install ACF Pro, WPGraphQL and WPGraphQL for ACF, then run:
 * wp tms seed
 *
 * @package TechMySpace
 */

declare(strict_types=1);

require __DIR__ . '/inc/post-types.php';
require __DIR__ . '/inc/acf-fields.php';
require __DIR__ . '/inc/seed.php';

add_action(
	'after_setup_theme',
	static function (): void {
		add_theme_support('post-thumbnails');
		add_theme_support('title-tag');
	}
);

add_action(
	'after_switch_theme',
	static function (): void {
		tms_register_post_types();
		flush_rewrite_rules();
	}
);

add_action(
	'admin_notices',
	static function (): void {
		if (function_exists('acf_add_local_field_group') && class_exists('WPGraphQL')) {
			return;
		}

		echo '<div class="notice notice-warning"><p>Tech My Space needs ACF Pro, WPGraphQL, and WPGraphQL for ACF before the Next.js site can read content.</p></div>';
	}
);
