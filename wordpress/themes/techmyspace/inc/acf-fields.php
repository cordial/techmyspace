<?php
/**
 * ACF field groups, registered in PHP so the theme owns the schema.
 *
 * @package TechMySpace
 */

declare(strict_types=1);

add_action('acf/init', 'tms_register_field_groups');

function tms_register_field_groups(): void
{
	if (!function_exists('acf_add_local_field_group')) {
		return;
	}

	acf_add_local_field_group(tms_group(
		'group_tms_service',
		'Service details',
		'ServiceDetails',
		'serviceDetails',
		['Service'],
		[[['param' => 'post_type', 'operator' => '==', 'value' => 'service']]],
		array_merge(
			[
				tms_text('field_service_hero_title', 'Hero title', 'heroTitle'),
				tms_textarea('field_service_summary', 'Summary', 'summary'),
				tms_select(
					'field_service_hero_diagram',
					'Hero diagram',
					'heroDiagram',
					[
						'' => 'None (use the hero image, or the first gallery photo)',
						'alarms' => 'Alarm floor plan',
						'cctv' => 'CCTV coverage plan',
						'wifi' => 'Wi-Fi main site and remote link',
					]
				),
				tms_image('field_service_hero_image', 'Hero image (shown when no diagram is chosen)', 'heroImage'),
				tms_textarea('field_service_hero_caption', 'Hero diagram or image caption', 'heroCaption'),
				tms_text('field_service_hero_button_label', 'Hero button label (links to the contact block)', 'heroButtonLabel'),
				tms_repeater(
					'field_service_facts',
					'Fact strip',
					'facts',
					[tms_text('field_service_fact_label', 'Label', 'label')]
				),
				tms_flexible_content(
					'field_service_sections',
					'Page sections',
					'sections',
					[
						tms_section_layout('cards', 'Cards', [
							tms_text('field_section_cards_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_cards_item_body', 'Body', 'body'),
							tms_text('field_section_cards_item_link', 'Link (optional, e.g. /services/av or #venue-guide)', 'link'),
						]),
						tms_section_layout('propertyTabs', 'Property type tabs', [
							tms_text('field_section_tabs_item_label', 'Tab label', 'tabLabel'),
							tms_text('field_section_tabs_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_tabs_item_body', 'Body', 'body'),
							tms_textarea('field_section_tabs_item_profiles', 'Property list', 'profiles'),
						]),
						tms_section_layout('steps', 'Numbered steps', [
							tms_text('field_section_steps_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_steps_item_body', 'Body', 'body'),
						]),
						tms_section_layout('accordion', 'Expandable list', [
							tms_text('field_section_accordion_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_accordion_item_body', 'Body', 'body'),
						]),
						tms_section_layout('checklist', 'Ticked list', [
							tms_text('field_section_checklist_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_checklist_item_body', 'Body', 'body'),
						]),
						tms_section_layout('venueGuide', 'Venue guide', [
							tms_text('field_section_venues_item_nav', 'Button label (leave blank for no button)', 'navLabel'),
							tms_text('field_section_venues_item_title', 'Title', 'title'),
							tms_wysiwyg('field_section_venues_item_body', 'Body', 'body'),
							tms_text('field_section_venues_item_profiles_label', 'Property list label (defaults to "Property profiles")', 'profilesLabel'),
							tms_textarea('field_section_venues_item_profiles', 'Property profiles', 'profiles'),
							tms_image('field_section_venues_item_image', 'Image', 'image'),
							tms_textarea('field_section_venues_item_caption', 'Image caption', 'imageCaption'),
						]),
					]
				),
				tms_repeater(
					'field_service_questions',
					'Page questions',
					'questions',
					[
						tms_text('field_service_question', 'Question', 'question'),
						tms_wysiwyg('field_service_answer', 'Answer', 'answer'),
					]
				),
				tms_text('field_service_survey_heading', 'Survey heading', 'surveyHeading'),
				tms_textarea('field_service_survey_body', 'Survey text', 'surveyBody'),
				tms_repeater(
					'field_service_features',
					'Features (pages without sections)',
					'features',
					[
						tms_text('field_service_feature_title', 'Title', 'title'),
						tms_wysiwyg('field_service_feature_body', 'Body', 'body'),
					]
				),
				tms_wysiwyg('field_service_body', 'Body', 'body'),
				tms_gallery('field_service_gallery', 'Gallery', 'gallery'),
				tms_relationship('field_service_related_faqs', 'Related FAQs', 'relatedFaqs', ['faq']),
			],
			tms_seo_fields('service')
		)
	));

	acf_add_local_field_group(tms_group(
		'group_tms_case_study',
		'Case study details',
		'CaseStudyDetails',
		'caseStudyDetails',
		['CaseStudy'],
		[[['param' => 'post_type', 'operator' => '==', 'value' => 'case_study']]],
		array_merge(
			[
				tms_text('field_case_location', 'Location', 'location'),
				tms_textarea('field_case_summary', 'Summary', 'summary'),
				tms_wysiwyg('field_case_body', 'Body', 'body'),
				tms_textarea('field_case_pull_quote', 'Pull quote', 'pullQuote'),
				tms_gallery('field_case_gallery', 'Gallery', 'gallery'),
			],
			tms_seo_fields('case')
		)
	));

	acf_add_local_field_group(tms_group(
		'group_tms_faq',
		'FAQ details',
		'FaqDetails',
		'faqDetails',
		['Faq'],
		[[['param' => 'post_type', 'operator' => '==', 'value' => 'faq']]],
		array_merge(
			[
				tms_wysiwyg('field_faq_answer', 'Answer', 'answer'),
				tms_post_object('field_faq_service', 'Service', 'service', ['service']),
			],
			tms_seo_fields('faq')
		)
	));

	acf_add_local_field_group(tms_group(
		'group_tms_testimonial',
		'Testimonial details',
		'TestimonialDetails',
		'testimonialDetails',
		['Testimonial'],
		[[['param' => 'post_type', 'operator' => '==', 'value' => 'testimonial']]],
		array_merge(
			[
				tms_textarea('field_testimonial_quote', 'Quote', 'quote'),
				tms_text('field_testimonial_author', 'Author', 'author'),
				tms_text('field_testimonial_location', 'Location', 'location'),
				tms_text('field_testimonial_service', 'Service', 'serviceLabel'),
			],
			tms_seo_fields('testimonial')
		)
	));

	acf_add_local_field_group(tms_group(
		'group_tms_page',
		'Page details',
		'PageDetails',
		'pageDetails',
		['Page'],
		[[['param' => 'post_type', 'operator' => '==', 'value' => 'page']]],
		array_merge(
			[
				tms_text('field_page_kicker', 'Hero kicker', 'heroKicker'),
				tms_textarea('field_page_summary', 'Summary', 'summary'),
				tms_wysiwyg('field_page_body', 'Body', 'body'),
				tms_gallery('field_page_gallery', 'Gallery', 'gallery'),
			],
			tms_seo_fields('page')
		)
	));

	acf_add_local_field_group(tms_group(
		'group_tms_home',
		'Home details',
		'HomeDetails',
		'homeDetails',
		['Page'],
		[[
			[
				'param' => 'page_template',
				'operator' => '==',
				'value' => 'page-templates/home.php',
			],
		]],
		array_merge(
			[
				tms_text('field_home_kicker', 'Hero kicker', 'heroKicker'),
				tms_text('field_home_title', 'Hero title', 'heroTitle'),
				tms_text('field_home_accent', 'Hero accent', 'heroAccent'),
				tms_textarea('field_home_summary', 'Hero summary', 'heroSummary'),
				tms_text('field_home_intro_title', 'Intro title', 'introTitle'),
				tms_wysiwyg('field_home_intro', 'Intro', 'intro'),
				tms_wysiwyg('field_home_areas_body', 'Areas copy', 'areasBody'),
				tms_repeater(
					'field_home_areas',
					'Areas',
					'areas',
					[tms_text('field_home_area_label', 'Label', 'label')]
				),
				tms_repeater(
					'field_home_awards',
					'Awards',
					'awards',
					[tms_text('field_home_award_label', 'Label', 'label')]
				),
				tms_text('field_home_phone', 'Phone', 'phone'),
				tms_text('field_home_phone_tel', 'Phone link', 'phoneTel'),
			],
			tms_seo_fields('home')
		)
	));
}

/**
 * @param array<int, array<string, mixed>> $fields
 * @param array<int, string> $graphql_types
 * @param array<int, array<int, array<string, string>>> $location
 * @return array<string, mixed>
 */
function tms_group(
	string $key,
	string $title,
	string $graphql_type_name,
	string $graphql_field_name,
	array $graphql_types,
	array $location,
	array $fields
): array {
	return [
		'key' => $key,
		'title' => $title,
		'fields' => $fields,
		'location' => $location,
		'show_in_graphql' => true,
		'graphql_field_name' => $graphql_field_name,
		'graphql_type_name' => $graphql_type_name,
		'graphql_types' => $graphql_types,
		'map_graphql_types_from_location_rules' => false,
	];
}

/**
 * @return array<string, mixed>
 */
function tms_text(string $key, string $label, string $name): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'text',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @return array<string, mixed>
 */
function tms_textarea(string $key, string $label, string $name): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'textarea',
		'rows' => 4,
		'new_lines' => '',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @return array<string, mixed>
 */
function tms_wysiwyg(string $key, string $label, string $name): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'wysiwyg',
		'media_upload' => 0,
		'toolbar' => 'basic',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @param array<int, array<string, mixed>> $sub_fields
 * @return array<string, mixed>
 */
function tms_repeater(string $key, string $label, string $name, array $sub_fields): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'repeater',
		'layout' => 'block',
		'button_label' => 'Add row',
		'sub_fields' => $sub_fields,
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @param array<string, string> $choices
 * @return array<string, mixed>
 */
function tms_select(string $key, string $label, string $name, array $choices): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'select',
		'choices' => $choices,
		'default_value' => '',
		'allow_null' => 0,
		'multiple' => 0,
		'return_format' => 'value',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @return array<string, mixed>
 */
function tms_image(string $key, string $label, string $name): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'image',
		'return_format' => 'id',
		'preview_size' => 'medium',
		'library' => 'all',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @param array<int, array<string, mixed>> $layouts
 * @return array<string, mixed>
 */
function tms_flexible_content(string $key, string $label, string $name, array $layouts): array
{
	$keyed = [];
	foreach ($layouts as $layout) {
		$keyed[$layout['key']] = $layout;
	}

	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'flexible_content',
		'button_label' => 'Add section',
		'layouts' => $keyed,
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * Every section shares a heading, an intro and a list of items. The items
 * repeater needs a per-layout GraphQL name, or WPGraphQL for ACF gives every
 * layout the same ServiceDetailsSectionsItems type.
 *
 * @param array<int, array<string, mixed>> $item_fields
 * @return array<string, mixed>
 */
function tms_section_layout(string $name, string $label, array $item_fields): array
{
	$prefix = 'field_section_' . strtolower($name);
	$items = tms_repeater($prefix . '_items', 'Items', 'items', $item_fields);
	$items['graphql_field_name'] = $name . 'Items';

	return [
		'key' => 'layout_section_' . strtolower($name),
		'name' => $name,
		'label' => $label,
		'display' => 'block',
		'sub_fields' => [
			tms_text($prefix . '_heading', 'Heading', 'heading'),
			tms_textarea($prefix . '_intro', 'Intro', 'intro'),
			$items,
		],
	];
}

/**
 * @return array<string, mixed>
 */
function tms_gallery(string $key, string $label, string $name): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'gallery',
		'return_format' => 'array',
		'preview_size' => 'medium',
		'library' => 'all',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @param array<int, string> $post_types
 * @return array<string, mixed>
 */
function tms_relationship(string $key, string $label, string $name, array $post_types): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'relationship',
		'post_type' => $post_types,
		'return_format' => 'id',
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @param array<int, string> $post_types
 * @return array<string, mixed>
 */
function tms_post_object(string $key, string $label, string $name, array $post_types): array
{
	return [
		'key' => $key,
		'label' => $label,
		'name' => $name,
		'type' => 'post_object',
		'post_type' => $post_types,
		'return_format' => 'id',
		'multiple' => 0,
		'ui' => 1,
		'show_in_graphql' => true,
		'graphql_field_name' => $name,
	];
}

/**
 * @return array<int, array<string, mixed>>
 */
function tms_seo_fields(string $prefix): array
{
	return [
		tms_text('field_' . $prefix . '_meta_title', 'Meta title', 'metaTitle'),
		tms_textarea('field_' . $prefix . '_meta_description', 'Meta description', 'metaDescription'),
	];
}
