<?php
/**
 * Content types for the headless site.
 *
 * @package TechMySpace
 */

declare(strict_types=1);

add_action('init', 'tms_register_post_types');

function tms_register_post_types(): void
{
	$shared = [
		'public' => true,
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'has_archive' => false,
		'exclude_from_search' => true,
		'supports' => ['title', 'thumbnail', 'revisions', 'page-attributes'],
	];

	register_post_type(
		'service',
		array_merge(
			$shared,
			[
				'labels' => tms_labels('Service', 'Services'),
				'menu_icon' => 'dashicons-shield',
				'rewrite' => ['slug' => 'services'],
				'graphql_single_name' => 'service',
				'graphql_plural_name' => 'services',
			]
		)
	);

	register_post_type(
		'case_study',
		array_merge(
			$shared,
			[
				'labels' => tms_labels('Case study', 'Case studies'),
				'menu_icon' => 'dashicons-portfolio',
				'rewrite' => ['slug' => 'case-studies'],
				'graphql_single_name' => 'caseStudy',
				'graphql_plural_name' => 'caseStudies',
			]
		)
	);

	register_post_type(
		'faq',
		array_merge(
			$shared,
			[
				'labels' => tms_labels('FAQ', 'FAQs'),
				'menu_icon' => 'dashicons-editor-help',
				'rewrite' => ['slug' => 'faq'],
				'graphql_single_name' => 'faq',
				'graphql_plural_name' => 'faqs',
			]
		)
	);

	register_post_type(
		'testimonial',
		array_merge(
			$shared,
			[
				'labels' => tms_labels('Testimonial', 'Testimonials'),
				'menu_icon' => 'dashicons-format-quote',
				'rewrite' => ['slug' => 'testimonials'],
				'graphql_single_name' => 'testimonial',
				'graphql_plural_name' => 'testimonials',
			]
		)
	);
}

/**
 * @return array<string, string>
 */
function tms_labels(string $singular, string $plural): array
{
	return [
		'name' => $plural,
		'singular_name' => $singular,
		'add_new_item' => 'Add new ' . strtolower($singular),
		'edit_item' => 'Edit ' . strtolower($singular),
		'not_found' => 'No ' . strtolower($plural) . ' found',
	];
}
