<?php
/**
 * Headless theme. Visitors should use the Next.js site.
 *
 * @package TechMySpace
 */

declare(strict_types=1);

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php bloginfo('name'); ?></title>
</head>
<body>
	<p><?php bloginfo('name'); ?> is edited here. The public site is the Next.js frontend.</p>
</body>
</html>
