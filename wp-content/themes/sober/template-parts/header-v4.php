<?php
/**
 * Template part for displaying header with ... .
 *
 * @package Sober
 */
?>

<div class="row">
	<div class="header-icon header-icon-left col-xs-3 col-sm-3 col-md-3 col-lg-2">
		<span class="toggle-nav hidden-lg" data-target="mobile-menu"><span class="icon-nav"></span></span>

		<ul class="hidden-xs hidden-sm hidden-md">
			<?php sober_header_icons( 'v4', 'left' ) ?>
		</ul>
	</div><!-- .header-icon -->

	<div class="header-content col-xs-6 col-sm-6 col-md-6 col-lg-8">
		<nav class="main-navigation primary-nav site-navigation hidden-xs hidden-sm hidden-md">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'nav-menu' ) ); ?>
		</nav><!-- #site-navigation -->

		<div class="site-branding">
			<?php get_template_part( 'template-parts/logo' ); ?>
		</div><!-- .site-branding -->

		<nav class="main-navigation secondary-nav site-navigation hidden-xs hidden-sm hidden-md">
			<?php wp_nav_menu( array( 'theme_location' => 'secondary', 'container' => false, 'menu_class' => 'nav-menu' ) ); ?>
		</nav><!-- #site-navigation -->
	</div>

	<div class="header-icon header-icon-right col-xs-3 col-sm-3 col-md-3 col-lg-2">
		<ul class="hidden-xs hidden-sm hidden-md">
			<?php sober_header_icons( 'v4', 'right' ) ?>
		</ul>

		<?php if ( function_exists( 'WC' ) ) : ?>
			<a href="<?php echo esc_url( wc_get_cart_url() ) ?>" class="cart-contents menu-item-mobile-cart hidden-lg" data-toggle="modal" data-target="cart-modal" data-tab="cart">
				<?php sober_shopping_cart_icon() ?>
				<?php if ( sober_get_option( 'mobile_cart_badge' ) ) : ?>
					<span class="count cart-counter"><?php echo intval( WC()->cart->get_cart_contents_count() ) ?></span>
				<?php endif; ?>
			</a>
		<?php endif; ?>
	</div><!-- .header-icon -->
</div>