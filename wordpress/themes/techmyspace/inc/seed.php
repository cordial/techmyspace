<?php
/**
 * wp tms seed — create or update content from seed/content.json.
 *
 * @package TechMySpace
 */

declare(strict_types=1);

if (defined('WP_CLI') && WP_CLI) {
	WP_CLI::add_command('tms seed', 'tms_seed_command');
}

/**
 * Create or update content from seed/content.json.
 *
 * ## OPTIONS
 *
 * [--services=<slugs>]
 * : Comma-separated service slugs. Seeds only those services and leaves all
 * other content as it is in WordPress.
 *
 * ## EXAMPLES
 *
 *     wp tms seed
 *     wp tms seed --services=av,structured-cabling
 *
 * @param array<int, string> $args
 * @param array<string, string> $assoc_args
 */
function tms_seed_command(array $args = [], array $assoc_args = []): void
{
	if (!function_exists('update_field')) {
		WP_CLI::error('ACF Pro is not active.');
	}

	$path = get_template_directory() . '/seed/content.json';
	if (!is_readable($path)) {
		WP_CLI::error('Seed file is missing at ' . $path);
	}

	$data = json_decode((string) file_get_contents($path), true);
	if (!is_array($data)) {
		WP_CLI::error('Seed file is not valid JSON.');
	}

	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$only_services = array_filter(array_map('trim', explode(',', (string) ($assoc_args['services'] ?? ''))));
	if ($only_services) {
		$known = array_column($data['services'] ?? [], 'slug');
		$unknown = array_diff($only_services, $known);
		if ($unknown) {
			WP_CLI::error('No such service in the seed file: ' . implode(', ', $unknown));
		}
		foreach ($data['services'] ?? [] as $service) {
			if (in_array((string) $service['slug'], $only_services, true)) {
				tms_seed_service($service);
			}
		}
		WP_CLI::success('Seeded ' . implode(', ', $only_services) . '. Other content was left as it is.');
		return;
	}

	if (get_option('permalink_structure') !== '/%postname%/') {
		update_option('permalink_structure', '/%postname%/');
		flush_rewrite_rules();
	}

	$site = $data['site'] ?? [];
	update_option('blogname', (string) ($site['name'] ?? 'Tech My Space'));
	update_option('blogdescription', (string) ($site['tagline'] ?? ''));

	$service_ids = [];
	foreach ($data['services'] ?? [] as $service) {
		$service_ids[(string) $service['slug']] = tms_seed_service($service);
	}

	foreach ($data['caseStudies'] ?? [] as $study) {
		$id = tms_upsert_post('case_study', (string) $study['slug'], (string) $study['title'], (int) $study['menuOrder']);
		$image_ids = tms_sideload_all($study['images'] ?? [], $id);
		tms_set_featured($id, $image_ids);
		update_field('location', (string) ($study['location'] ?? ''), $id);
		update_field('summary', (string) ($study['summary'] ?? ''), $id);
		update_field('body', (string) ($study['body'] ?? ''), $id);
		update_field('pullQuote', (string) ($study['pullQuote'] ?? ''), $id);
		update_field('gallery', $image_ids, $id);
		update_field('metaTitle', (string) ($study['metaTitle'] ?? ''), $id);
		update_field('metaDescription', (string) ($study['metaDescription'] ?? ''), $id);
		WP_CLI::log('Case study ' . $study['slug']);
	}

	$faq_ids_by_service = [];
	foreach ($data['faqs'] ?? [] as $index => $faq) {
		$id = tms_upsert_post('faq', (string) $faq['slug'], (string) $faq['title'], (int) $index);
		$service_slug = (string) ($faq['service'] ?? '');
		$service_id = $service_ids[$service_slug] ?? 0;
		update_field('answer', (string) ($faq['answer'] ?? ''), $id);
		update_field('service', $service_id ?: '', $id);
		update_field('metaTitle', (string) ($faq['metaTitle'] ?? ''), $id);
		update_field('metaDescription', (string) ($faq['metaDescription'] ?? ''), $id);
		if ($service_id) {
			$faq_ids_by_service[$service_slug][] = $id;
		}
	}
	WP_CLI::log('FAQs ' . count($data['faqs'] ?? []));

	foreach ($faq_ids_by_service as $slug => $ids) {
		if (isset($service_ids[$slug])) {
			update_field('relatedFaqs', $ids, $service_ids[$slug]);
		}
	}

	foreach ($data['testimonials'] ?? [] as $index => $review) {
		$id = tms_upsert_post('testimonial', (string) $review['slug'], (string) $review['title'], (int) $index);
		update_field('quote', (string) ($review['quote'] ?? ''), $id);
		update_field('author', (string) ($review['author'] ?? ''), $id);
		update_field('location', (string) ($review['location'] ?? ''), $id);
		update_field('serviceLabel', (string) ($review['serviceLabel'] ?? ''), $id);
		update_field('metaTitle', (string) ($review['metaTitle'] ?? ''), $id);
		update_field('metaDescription', (string) ($review['metaDescription'] ?? ''), $id);
	}
	WP_CLI::log('Testimonials ' . count($data['testimonials'] ?? []));

	foreach ($data['pages'] ?? [] as $page) {
		$id = tms_upsert_post('page', (string) $page['slug'], (string) $page['title'], 0);
		update_post_meta($id, '_wp_page_template', 'default');
		$image_ids = tms_sideload_all($page['images'] ?? [], $id);
		tms_set_featured($id, $image_ids);
		update_field('heroKicker', (string) ($page['heroKicker'] ?? ''), $id);
		update_field('summary', (string) ($page['summary'] ?? ''), $id);
		update_field('body', (string) ($page['body'] ?? ''), $id);
		update_field('gallery', $image_ids, $id);
		update_field('metaTitle', (string) ($page['metaTitle'] ?? ''), $id);
		update_field('metaDescription', (string) ($page['metaDescription'] ?? ''), $id);
		WP_CLI::log('Page ' . $page['slug']);
	}

	$home = $data['home'] ?? [];
	$home_id = tms_upsert_post('page', 'home', 'Home', 0);
	update_post_meta($home_id, '_wp_page_template', 'page-templates/home.php');
	update_field('heroKicker', (string) ($home['heroKicker'] ?? ''), $home_id);
	update_field('heroTitle', (string) ($home['heroTitle'] ?? ''), $home_id);
	update_field('heroAccent', (string) ($home['heroAccent'] ?? ''), $home_id);
	update_field('heroSummary', (string) ($home['heroSummary'] ?? ''), $home_id);
	update_field('introTitle', (string) ($home['introTitle'] ?? ''), $home_id);
	update_field('intro', (string) ($home['intro'] ?? ''), $home_id);
	update_field('areasBody', (string) ($home['areasBody'] ?? ''), $home_id);
	update_field('areas', tms_label_rows($home['areas'] ?? []), $home_id);
	update_field('awards', tms_label_rows($home['awards'] ?? []), $home_id);
	update_field('phone', (string) ($site['phone'] ?? ''), $home_id);
	update_field('phoneTel', (string) ($site['phoneTel'] ?? ''), $home_id);
	update_field('metaTitle', (string) ($home['metaTitle'] ?? ''), $home_id);
	update_field('metaDescription', (string) ($home['metaDescription'] ?? ''), $home_id);
	update_option('show_on_front', 'page');
	update_option('page_on_front', $home_id);

	WP_CLI::success('Tech My Space content is seeded.');
}

/**
 * @param array<string, mixed> $service
 */
function tms_seed_service(array $service): int
{
	$id = tms_upsert_post('service', (string) $service['slug'], (string) $service['title'], (int) $service['menuOrder']);
	$image_ids = tms_sideload_all($service['images'] ?? [], $id);
	tms_set_featured($id, $image_ids);
	update_field('heroTitle', (string) ($service['heroTitle'] ?? ''), $id);
	update_field('summary', (string) ($service['summary'] ?? ''), $id);
	update_field('heroDiagram', (string) ($service['heroDiagram'] ?? ''), $id);
	update_field('heroImage', tms_image_value($service['heroImage'] ?? [], $id), $id);
	update_field('heroCaption', (string) ($service['heroCaption'] ?? ''), $id);
	update_field('heroButtonLabel', (string) ($service['heroButtonLabel'] ?? ''), $id);
	update_field('facts', tms_label_rows($service['facts'] ?? []), $id);
	update_field('sections', tms_section_rows($service['sections'] ?? [], $id), $id);
	update_field('body', (string) ($service['body'] ?? ''), $id);
	update_field('features', tms_rows($service['features'] ?? [], ['title', 'body']), $id);
	update_field('questions', tms_rows($service['questions'] ?? [], ['question', 'answer']), $id);
	update_field('surveyHeading', (string) ($service['surveyHeading'] ?? ''), $id);
	update_field('surveyBody', (string) ($service['surveyBody'] ?? ''), $id);
	update_field('gallery', $image_ids, $id);
	update_field('metaTitle', (string) ($service['metaTitle'] ?? ''), $id);
	update_field('metaDescription', (string) ($service['metaDescription'] ?? ''), $id);
	WP_CLI::log('Service ' . $service['slug']);

	return $id;
}

function tms_upsert_post(string $post_type, string $slug, string $title, int $menu_order): int
{
	$existing = get_posts([
		'name' => $slug,
		'post_type' => $post_type,
		'post_status' => 'any',
		'posts_per_page' => 1,
		'fields' => 'ids',
	]);

	$postarr = [
		'post_type' => $post_type,
		'post_name' => $slug,
		'post_title' => $title,
		'post_status' => 'publish',
		'menu_order' => $menu_order,
	];

	if ($existing) {
		$postarr['ID'] = (int) $existing[0];
		$result = wp_update_post($postarr, true);
	} else {
		$result = wp_insert_post($postarr, true);
	}

	if (is_wp_error($result)) {
		WP_CLI::error($result->get_error_message());
	}

	return (int) $result;
}

/**
 * @param array<int, array<string, string>> $images
 * @return array<int, int>
 */
function tms_sideload_all(array $images, int $post_id): array
{
	$ids = [];
	foreach ($images as $image) {
		$url = (string) ($image['url'] ?? '');
		if ($url === '') {
			continue;
		}
		$id = tms_sideload($url, $post_id, (string) ($image['alt'] ?? ''));
		if ($id) {
			$ids[] = $id;
		}
	}
	return $ids;
}

function tms_sideload(string $url, int $post_id, string $alt): int
{
	$existing = get_posts([
		'post_type' => 'attachment',
		'post_status' => 'inherit',
		'meta_key' => '_tms_source_url',
		'meta_value' => $url,
		'posts_per_page' => 1,
		'fields' => 'ids',
	]);

	if ($existing) {
		return (int) $existing[0];
	}

	$path = (string) wp_parse_url($url, PHP_URL_PATH);
	if (preg_match('/\.(jpe?g|png|gif|webp)$/i', $path)) {
		$id = media_sideload_image($url, $post_id, $alt, 'id');
	} else {
		$id = tms_sideload_without_extension($url, $path, $post_id, $alt);
	}
	if (is_wp_error($id)) {
		WP_CLI::warning($id->get_error_message() . ' ' . $url);
		return 0;
	}

	update_post_meta((int) $id, '_tms_source_url', $url);
	if ($alt !== '') {
		update_post_meta((int) $id, '_wp_attachment_image_alt', $alt);
	}

	return (int) $id;
}

/**
 * media_sideload_image() rejects URLs without a file extension, which rules
 * out image CDNs such as images.unsplash.com.
 *
 * @return int|WP_Error
 */
function tms_sideload_without_extension(string $url, string $path, int $post_id, string $alt)
{
	$tmp = download_url($url);
	if (is_wp_error($tmp)) {
		return $tmp;
	}

	$file = [
		'name' => sanitize_file_name(basename($path) ?: 'image') . '.jpg',
		'tmp_name' => $tmp,
	];
	$id = media_handle_sideload($file, $post_id, $alt);
	if (is_wp_error($id) && file_exists($tmp)) {
		wp_delete_file($tmp);
	}

	return $id;
}

/**
 * Value for an ACF image field: the sideloaded attachment ID, or '' when the
 * seed has no image or the download fails.
 *
 * @param array<string, string> $image
 * @return int|string
 */
function tms_image_value(array $image, int $post_id)
{
	$url = (string) ($image['url'] ?? '');
	if ($url === '') {
		return '';
	}

	return tms_sideload($url, $post_id, (string) ($image['alt'] ?? '')) ?: '';
}

/**
 * Flexible content rows for the service "sections" field. Item values that
 * are arrays are images ({url, alt}) and are sideloaded to attachment IDs.
 *
 * @param array<int, array<string, mixed>> $sections
 * @return array<int, array<string, mixed>>
 */
function tms_section_rows(array $sections, int $post_id): array
{
	$rows = [];
	foreach ($sections as $section) {
		$items = [];
		foreach ($section['items'] ?? [] as $item) {
			$row = [];
			foreach ($item as $key => $value) {
				if (is_array($value)) {
					$row[$key] = tms_image_value($value, $post_id);
					continue;
				}
				$row[$key] = (string) $value;
			}
			$items[] = $row;
		}
		$rows[] = [
			'acf_fc_layout' => (string) ($section['layout'] ?? ''),
			'heading' => (string) ($section['heading'] ?? ''),
			'intro' => (string) ($section['intro'] ?? ''),
			'items' => $items,
		];
	}
	return $rows;
}

/**
 * @param array<int, int> $image_ids
 */
function tms_set_featured(int $post_id, array $image_ids): void
{
	if ($image_ids) {
		set_post_thumbnail($post_id, $image_ids[0]);
	}
}

/**
 * @param array<int, array<string, string>> $rows
 * @param array<int, string> $keys
 * @return array<int, array<string, string>>
 */
function tms_rows(array $rows, array $keys): array
{
	$prepared = [];
	foreach ($rows as $row) {
		$item = [];
		foreach ($keys as $key) {
			$item[$key] = (string) ($row[$key] ?? '');
		}
		$prepared[] = $item;
	}
	return $prepared;
}

/**
 * @param array<int, string> $labels
 * @return array<int, array<string, string>>
 */
function tms_label_rows(array $labels): array
{
	$rows = [];
	foreach ($labels as $label) {
		$rows[] = ['label' => (string) $label];
	}
	return $rows;
}
